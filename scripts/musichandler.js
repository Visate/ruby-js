// main music commands
const config = require("../config.json");
const ytdl = require("ytdl-core");
const request = require("request");
const stripIndents = require("common-tags").stripIndents;

function play(bot, guild, song) {
  let player = bot.connections[guild.id];
  if (!player) return;
  else if (!song) {
    player.tChannel.sendMessage("The queue is empty! Better add some more songs~");
    player.playing = false;
    return;
  }

  let embed = {
    color: 3447003,
    author: {
      name: `${song.requestedBy.username}#${song.requestedBy.discriminator} (${song.requestedBy.id})`,
      icon_url: song.requestedBy.avatarURL
    },
    description: `${song.queueUrl ? `[${song.title}](${song.queueUrl})` : `**${song.title}**`} (${song.length === "unknown" ? "?:??" : song.length})`,
    image: song.thumbnail
  };
  player.tChannel.sendEmbed(embed);
  let stream;
  if (song.source === "youtube") stream = ytdl(song.url, {filter: "audioonly"});
  else if (song.source === "soundcloud" || song.source === "other") stream = request(song.url);

  player.dispatcher = player.vChannel.connection.playStream(stream, {volume: player.volume / 50, passes: 2});
  player.playing = true;

  player.dispatcher.on("end", () => {
    let oldSong = player.queue.shift();
    if (player.looping) player.queue.push(oldSong);
    play(bot, player.guild, player.queue[0]);
  });

  player.dispatcher.on("error", err => {
    player.tChannel.sendMessage(`Error occurred during playback: ${err}`);
    player.queue.shift();
    play(bot, player.guild, player.queue[0]);
  });
}

exports.createPlayer = (bot, msg, djModeStatus) => {
  bot.connections[msg.guild.id] = {
    djMode: djModeStatus,
    guild: msg.guild,
    vChannel: msg.member.voiceChannel,
    tChannel: msg.channel,
    volume: config.defaults.volume,
    dispatcher: null,
    streaming: false,
    stream: null,
    playing: false,
    looping: false,
    skipVote: 0,
    skipRequired: 0,
    queue: [],
    timeout: null
  };

  msg.channel.sendMessage(`Connected to voice channel ${msg.member.voiceChannel.name} and binding to ${msg.channel}.`);
};

exports.deletePlayer = (bot, guild) => {
  bot.connections[guild.id] = undefined;
};

exports.getPlayer = (bot, guild) => {
  return bot.connections[guild.id];
};

exports.setDJMode = (bot, guild, djModeStatus) => {
  if (bot.connections[guild.id]) bot.connections[guild.id].djMode = djModeStatus;
};

exports.checkDJ = (bot, msg) => {
  let player = bot.connections[msg.guild.id];
  if (player) {
    if (!player.djMode) return true;
    else if (player.djMode && bot.checkPerms(msg) > 1) return true;
  }
  return false;
};

exports.isPlaying = (bot, guild) => {
  return bot.connections[guild.id] ? bot.connections[guild.id].playing : false;
};

exports.isStreaming = (bot, guild) => {
  return bot.connections[guild.id] ? bot.connections[guild.id].streaming : false;
};

exports.setDispatcher = (bot, guild, dispatcher) => {
  if (bot.connections[guild.id]) bot.connections[guild.id].dispatcher = dispatcher;
};

exports.startStreaming = (bot, msg, stream) => {
  let player = bot.connections[msg.guild.id];
  if (player && stream) {
    player.dispatcher = player.vChannel.connection.playStream(request(stream.url), {volume: player.volume / 50, passes: 2});
    player.streaming = true;
    player.stream = stream;
    player.playing = false;
    player.queue = [];
    msg.channel.sendMessage(`Starting stream from ${stream.name}~`);
  }
};

exports.addToQueue = (bot, msg, songTitle, songLength, thumbnail, queueUrl, songUrl, songSource) => {
  let player = bot.connections[msg.guild.id];
  if (player) {
    let song = {
      title: songTitle,
      requestedBy: msg.author,
      length: songLength,
      thumbnail: thumbnail,
      queueUrl: queueUrl,
      url: songUrl,
      source: songSource
    };

    player.queue.push(song);
    let position = "Up next!";
    if (player.queue.length > 1) position = player.queue.length - 1;
    let embed = {
      color: 3447003,
      author: {
        name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
        icon_url: msg.author.avatarURL
      },
      description: stripIndents`
      :thumbsup: ${queueUrl ? `[${songTitle}](${queueUrl})` : `**${songTitle}**`} (${songLength === "unknown" ? "?:??" : songLength})
      **Position:** ${position}`
    };
    msg.channel.sendEmbed(embed);
    if (player.streaming) {
      player.streaming = false;
      player.stream = null;
    }
    if (!player.playing) play(bot, msg.guild, song);
  }
};

exports.toggleLooping = (bot, guild) => {
  let player = bot.connections[guild.id];
  if (player.looping) player.looping = false;
  else if (!player.looping) player.looping = true;
  return player.looping;
};

exports.stopPlayback = (bot, guild) => {
  let player = bot.connections[guild.id];
  player.streaming = false;
  player.playing = false;
  player.queue = [];
  player.dispatcher.end();
};

exports.pausePlayback = (bot, msg) => {
  let player = bot.connections[msg.guild.id];
  if (!player.streaming) {
    if (!player.dispatcher.paused) msg.channel.sendMessage("Pausing playback!").then(() => player.dispatcher.pause());
  }
};

exports.resumePlayback = (bot, msg) => {
  let player = bot.connections[msg.guild.id];
  if (!player.streaming) {
    if (player.dispatcher.paused) msg.channel.sendMessage("Resuming playback!").then(() => player.dispatcher.resume());
  }
};

exports.skipSong = (bot, msg) => {
  let permLvl = bot.checkPerms(msg);
  let player = bot.connections[msg.guild.id];
  if (player && player.playing) {
    if (permLvl > 1) {
      msg.channel.sendMessage(`Skipped ${player.queue[0].title}!`).then(() => player.dispatcher.end());
    }

    else if (!player.djMode) {
      let unmutedCount = player.vChannel.members.filter(m => !m.selfDeaf && !m.serverDeaf && m.id !== bot.user.id).size;
      player.skipRequired = ~~(unmutedCount * 0.33);
      player.skipVote += 1;
      if (player.skipVote >= player.skipRequired) {
        player.skipVote = 0;
        msg.channel.sendMessage(`Skipped ${player.queue[0].title}!`).then(() => player.dispatcher.end());
      }
      else msg.channel.sendMessage(`Vote to skip acknowledged! Required votes to skip: **${player.skipRequired - player.skipVote} votes** \`[${player.skipVote}/${player.skipRequired}]\``);
    }
  }
};

exports.getQueueLength = (bot, guild) => {
  let player = bot.connections[guild.id];
  if (player && player.playing) {
    let totalMin = 0;
    let totalSec = 0;
    let unknown = false;
    player.queue.forEach(song => {
      if (song.length === "unknown") {
        unknown = true;
        return;
      }
      let time = song.length.split(":");
      totalMin += parseInt(time[0]);
      totalSec += parseInt(time[1], 10);
      if (totalSec >= 60) {
        totalSec -= 60;
        totalMin += 1;
      }
    });

    return `${unknown ? "~" : ""}${totalMin}:${totalSec < 10 ? `0${totalSec}` : totalSec}`;
  }

  return null;
};

exports.songTimeLeft = (bot, guild, min, sec) => {
  let player = bot.connections[guild.id];
  if (player && player.playing) {
    let currentSong = player.queue[0];
    if (!currentSong) return null;
    if (currentSong.length === "unknown") return "unknown";
    let [ songMin, songSec ] = currentSong.length.split(":");
    let resultSec = parseInt(songSec, 10) - sec;
    let resultMin = parseInt(songMin, 10) - min;
    if (resultSec < 0) {
      resultMin -= 1;
      resultSec += 60;
    }

    return `${resultMin}:${resultSec < 10 ? `0${resultSec}` : resultSec}`;
  }
};

exports.getVolume = (bot, guild) => {
  let player = bot.connections[guild.id];
  if (player) return player.volume;
  return null;
};

exports.setVolume = (bot, guild, volume) => {
  let player = bot.connections[guild.id];
  if (player) {
    player.volume = volume;
    if (player.dispatcher) player.dispatcher.setVolume(player.volume / 50);
  }
};

exports.startTimeout = (bot, guild) => {
  let player = bot.connections[guild.id];
  console.log(`Starting music timeout for ${guild.name}`);
  player.timeout = setTimeout(() => {
    player.tChannel.sendMessage("Disconnecting from voice due to voice channel inactivity.");
    player.vChannel.connection.disconnect();
  }, 300000);
};

exports.cancelTimeout = (bot, guild) => {
  let player = bot.connections[guild.id];
  if (player && player.timeout) {
    clearTimeout(player.timeout);
    player.timeout = null;
  }
};
