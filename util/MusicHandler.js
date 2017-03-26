// Libraries
const ytdl = require("ytdl-core");
const request = require("request");

class MusicHandler {

  constructor(client, msg) {
    this.client = client;
    this.connections = {};
  }

  play(guild, song) {
    let player = this.connections[guild.id];
    if (!player) return;
    else if (!song) {
      player.notify("The queue is empty! Better add some more songs~");
      player.setPlaying(false);
      return;
    }

    let embed = {
      color: 3447003,
      author: {
        name: `${song.requestedBy.username}#${song.requestedBy.discriminator} (${song.requestedBy.id})`,
        icon_url: song.requestedBy.avatarURL
      },
      description: `${song.queueURL ? `[${song.title}](${song.queueURL})` : `**${song.title}**`} (${song.length === "unknown" ? "?:??" : this.client.util.toHHMMSS(song.length)})`,
      image: {
        url: song.thumbnail
      },
      footer: {
        text: "Now Playing",
        icon_url: this.client.user.avatarURL
      }
    };

    player.notifyEmbed(embed);

    let stream = song.source === "youtube" ? ytdl(song.songURL, {filter: "audioonly"}) : request(song.songURL);

    player.dispatcher = player.voice.connection.playStream(stream, {volume: player.volume / 50, passes: 2});
    player.setPlaying(true);

    player.dispatcher.on("end", reason => {
      this.client.warn(reason);
      let oldSong = player.queue.shift();
      if (player.looping) player.queue.push(oldSong);
      this.play(player.guild, player.queue[0]);
    });

    player.dispatcher.on("error", err => {
      player.notify(`Error occured during playback: ${err}`);
      player.queue.shift();
      this.play(player.guild, player.queue[0]);
    });
  }

  createPlayer(msg) {
    this.connections[msg.guild.id] = new MusicPlayer(this.client, msg);

    msg.channel.sendMessage(`Connected to voice channel ${msg.member.voiceChannel.name} and binding notifications to ${msg.channel}.`);
  }

  deletePlayer(guild) {
    delete this.connections[guild.id];
  }

  getPlayer(guild) {
    return this.connections[guild.id];
  }

  isDJ(msg) {
    return this.client.util.checkPerms(msg) > 1;
  }

  startStreaming(msg, stream) {
    let player = this.connections[msg.guild.id];
    if (player && stream) {
      player.dispatcher = player.voice.connection.playStream(request(stream.streamURL), {volume: player.volume / 50, passes: 2});
      player.setStreaming(true);
      player.setStream(stream);
      player.setPlaying(false);
      player.clearQueue();
      msg.channel.sendMessage(`Starting stream from ${stream.name}~`);
    }
  }

  queueSong(msg, title, length, thumbnail, queueURL, songURL, source) {
    let player = this.connections[msg.guild.id];
    if (player) {
      if (typeof thumbnail === "string") thumbnail.replace("http://", "https://");
      let song = new Song(title, msg.author, length, thumbnail, queueURL, songURL, source);

      player.addSong(song);
      let position = "Up next!";
      if (player.queue.length > 1) position = player.queue.length - 1;
      if (player.isLooping()) typeof position === "number" ? position += 1 : position = 1;

      let embed = {
        color: 3447003,
        author: {
          name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
          icon_url: msg.author.avatarURL
        },
        description: this.client.util.commonTags.stripIndents`
        :thumbsup: ${queueURL ? `[${title}](${queueURL})` : `**${title}**`} (${length === "unknown" ? "?:??" : this.client.util.toHHMMSS(length)})
        **Position:** ${position}`
      };

      msg.channel.sendEmbed(embed);

      if (player.isStreaming()) {
        player.setStreaming(false);
        player.setStream(null);
        player.dispatcher.end();
      }

      if (!player.isPlaying()) this.play(msg.guild, player.queue[0]);
    }
  }

  queuePlaylist(msg, YouTube, videos) {
    return new Promise(resolve => {
      let player = this.connections[msg.guild.id];
      let total = videos.length;
      let progress = 0;
      let failed = 0;

      function checkPromise(handler) {
        if (progress === total) {
          if (player.isStreaming()) player.stopStreaming();
          if (!player.isPlaying()) handler.play(msg.guild, player.queue[0]);
          resolve(total - failed);
        }
      }

      videos.forEach(video => {
        YouTube.getVideoByID(video.id).then(v => {
          progress++;
          let song = new Song(v.title, msg.author, v.durationSeconds, `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`, v.url, v.url, "youtube");
          player.addSong(song);
          checkPromise(this);
        }).catch(err => {
          progress++;
          failed++;
          checkPromise(this);
        });
      });
    });
  }

  shuffleQueue(msg) {
    let player = this.connections[msg.guild.id];
    if (player && player.isPlaying) {
      player.shuffleQueue();
      msg.channel.sendMessage("Music queue has been shuffled!");
    }
  }

  skipSong(msg) {
    let player = this.connections[msg.guild.id];

    if (player) {
      let unmutedCount = player.voice.members.filter(m => !m.selfDeaf && !m.serverDeaf && m.id !== this.client.user.id).size;
      player.skipRequired = ~~(unmutedCount * 0.33);
      player.skipVote += 1;
      if (player.skipVote >= player.skipRequired) {
        player.skipVote = 0;
        msg.channel.sendMessage(`Skipped ${player.queue[0].title}!`).then(() => player.skipSong());
      }
      else msg.channel.sendMessage(`Vote to skip acknowledged! Required votes to skip: **${player.skipRequired - player.skipVote} votes** \`[${player.skipVote}/${player.skipRequired}]\``);
    }
  }

  forceSkip(msg) {
    let player = this.connections[msg.guild.id];
    if (player && this.client.util.checkPerms(msg) > 1) {
      player.skipVote = 0;
      msg.channel.sendMessage(`Skipped ${player.queue[0].title}!`).then(() => player.skipSong());
    }
  }
}

class MusicPlayer {

  constructor(client, msg) {

    this.client = client;

    this.guild = msg.guild;
    this.voice = msg.member.voiceChannel;
    this.text = msg.channel;
    this.volume = 20;  // temporary set value until database
    this.dispatcher;

    this.streaming = false;
    this.stream;

    this.playing = false;
    this.looping = false;

    this.skipVote = 0;
    this.skipRequired = 0;

    this.queue = [];

    this.timeout;

  }

  isPlaying() {
    return this.playing;
  }

  setPlaying(status) {
    this.playing = status;
  }

  isStreaming() {
    return this.streaming;
  }

  setStreaming(status) {
    this.streaming = status;
  }

  setStream(stream) {
    this.stream = stream;
  }

  isLooping() {
    return this.looping;
  }

  toggleLooping() {
    return this.looping = !this.looping;
  }

  getVolume() {
    return this.volume;
  }

  setVolume(value) {
    this.volume = value;
  }

  shuffleQueue() {
    this.queue = [this.queue[0]].concat(this.client.util.shuffle(this.queue.slice(1)));
  }

  clearQueue() {
    this.queue = [];
  }

  stopStreaming() {
    this.streaming = false;
    this.stream = null;
    this.dispatcher.end();
  }

  stopPlayback() {
    this.streaming = false;
    this.playing = false;
    this.queue = [];
    this.dispatcher.end();
  }

  pausePlayback(msg) {
    if (!this.streaming && !this.dispatcher.paused) msg.channel.sendMessage("Pausing playback!").then(() => this.dispatcher.pause());
  }

  resumePlayback(msg) {
    if (!this.streaming && this.dispatcher.paused) msg.channel.sendMessage("Resuming playback!").then(() => this.dispatcher.resume());
  }

  addSong(song) {
    this.queue.push(song);
  }

  skipSong() {
    this.dispatcher.end();
  }

  getQueueLength() {
    let totalSec = 0;
    let unknown = false;

    this.queue.forEach(song => {
      if (song.length === "unknown") return unknown = true;
      totalSec += song.length;
    });

    return `${unknown ? "~" : ""}${this.client.util.toHHMMSS(totalSec)}`;
  }

  timeRemaining() {
    if (this.isPlaying()) {
      let currentSong = this.queue[0];
      if (!currentSong) return null;
      if (currentSong.length === "unknown") return currentSong.length;
      return this.client.util.toHHMMSS(currentSong.length - ~~(this.dispatcher.time / 1000));
    }
  }

  startTimeout() {
    this.timeout = setTimeout(() => {
      this.notify("Disconnecting from voice due to voice channel inactivity.");
      this.voice.connection.disconnect();
    }, 300000);
  }

  cancelTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  notify(...msg) {
    this.text.sendMessage(...msg);
  }

  notifyEmbed(embed) {
    this.text.sendEmbed(embed);
  }
}

class Song {

  constructor(title, requestedBy, length, thumbnail, queueURL, songURL, source) {
    this.title = title;
    this.requestedBy = requestedBy;
    this.length = length;
    this.thumbnail = thumbnail;
    this.queueURL = queueURL;
    this.songURL = songURL;
    this.source = source;
  }

}

module.exports = MusicHandler;
