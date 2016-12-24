// main music commands
const config = require("../config.json");
const ytdl = require("ytdl-core");
const request = require("request");
const connections = {};

function play(guild, song) {
  let player = connections.get(guild.id);
  if (!player) return;
  else if (!song) {
    player.tChannel.sendMessage("The queue is empty! Better add some more songs~");
    player.playing = false;
    return;
  }

  player.tChannel.sendMessage(`Playing **${song.title}** (${song.length}) requested by **${song.requestedBy}** \`[${song.length}]\``);
  let stream;
  if (song.source === "youtube") stream = ytdl(song.url, {filter: "audioonly"});
  else if (song.source === "soundcloud" || song.source === "other") stream = request(song.url);

  player.dispatcher = player.vChannel.connection.playStream(stream, {volume: player.volume / 50, passes: 2});
  player.playing = true;

  player.dispatcher.once("end", () => {
    let oldSong = player.queue.shift();
    if (player.looping) player.queue.push(oldSong);
    play(player.guild, player.queue[0]);
  });

  player.dispatcher.on("error", err => {
    player.tChannel.sendMessage(`Error occurred during playback: ${err}`);
    player.queue.shift();
    play(player.guild, player.queue[0]);
  });
}

exports.createPlayer = (msg, djModeStatus) => {
  connections[msg.guild.id] = {
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
};

exports.deletePlayer = guild => {
  connections[guild.id] = undefined;
};

exports.getPlayer = guild => {
  return connections[guild.id];
};

exports.setDJMode = (guild, djModeStatus) => {
  if (connections[guild.id]) connections[guild.id].djMode = djModeStatus;
};

exports.checkDJ = (bot, msg) => {
  let player = connections[msg.guild.id];
  if (player) {
    if (!player.djMode) return true;
    else if (player.djMode && bot.checkPerms(msg) > 1) return true;
  }
  return false;
};

exports.isPlaying = guild => {
  return connections[guild.id] ? connections[guild.id].playing : false;
};

exports.isStreaming = guild => {
  return connections[guild.id] ? connections[guild.id].streaming : false;
};

exports.setDispatcher = (guild, d) => {
  if (connections[guild.id]) connections[guild.id].dispatcher = d;
};

exports.startStreaming = (msg, stream) => {
  let player = connections[msg.guild.id];
  if (player && stream) {
    player.dispatcher = player.vChannel.connection.playStream(request(stream.url), {volume: player.volume / 50, passes: 2});
    player.streaming = true;
    player.stream = stream;
    player.playing = false;
    player.queue = [];
    msg.channel.sendMessage(`Starting stream from ${stream.name}~`);
  }
};

exports.addToQueue = (msg, songTitle, songLength, queueUrl, songUrl, songSource) => {
  let player = connections[msg.guild.id];
  if (player) {
    let song = {
      title: songTitle,
      requestedBy: msg.author,
      length: songLength,
      queueUrl: queueUrl,
      url: songUrl,
      source: songSource
    };

    player.queue.push(song);
    let position = "Up next!";
    if (player.queue.length > 1) position = player.queue.length - 1;
    msg.channel.sendMessage(`Queued **${song.title}** (${song.length}) requested by **${song.requestedBy}**~ Position in queue: ${position}`);
    if (!player.playing) play(msg.guild, song);
  }
};

exports.toggleLooping = guild => {
  let player = connections[guild.id];
  if (player.looping) player.looping = false;
  else if (!player.looping) player.looping = true;
  return player.looping;
};

exports.stopPlayback = guild => {
  let player = connections[guild.id];
  player.streaming = false;
  player.playing = false;
  player.queue = [];
  player.dispatcher.end();
};

exports.pausePlayback = msg => {
  let player = connections[msg.guild.id];
  if (!player.streaming) {
    if (!player.dispatcher.paused) msg.channel.sendMessage("Pausing playback!").then(() => player.dispatcher.pause());
  }
};

exports.resumePlayback = msg => {
  let player = connections[msg.guild.id];
  if (!player.streaming) {
    if (player.dispatcher.paused) msg.channel.sendMessage("Resuming playback!").then(() => player.dispatcher.resume());
  }
};

exports.skipSong = (bot, msg) => {
  let permLvl = bot.checkPerms(msg);
  let player = connections[msg.guild.id];
  if (player && player.playing) {
    if (permLvl > 1) {
      msg.channel.sendMessage("Skipped!").then(() => player.dispatcher.end());
    }

    else if (!player.djMode) {
      let unmutedCount = player.vChannel.members.filter(m => !m.selfDeaf && !m.serverDeaf && m.id !== bot.user.id).size;
      player.skipRequired = ~~(unmutedCount * 0.33);
      player.skipVote += 1;
      if (player.skipVote >= player.skipRequired) {
        player.skipVote = 0;
        msg.channel.sendMessage("Skipped!").then(() => player.dispatcher.end());
      }
      else msg.channel.sendMessage(`Vote to skip acknowledged! Required votes to skip: **${player.skipRequired - player.skipVote} votes** \`[${player.skipVote}/${player.skipRequired}]\``);
    }
  }
};

exports.getNowPlaying = guild => {
  let player = connections[guild.id];
  if (player && (player.streaming || player.playing)) {
    let milliSec = player.dispatcher.time;
    let totalSec = ~~(milliSec / 1000);
    let min = ~~(totalSec / 60);
    let sec = totalSec % 60;
    if (sec < 10) {
      sec = `0${sec}`;
    }

    if (player.streaming) {
      return `**${player.stream.np()}** streaming from **${player.stream.name}** [${min}:${sec}]`;
    }

    else if (player.playing) {
      return `**${player.queue[0].title}** requested by **${player.queue[0].requestedBy.username}** \`[${min}:${sec}/${player.queue[0].length}]\``;
    }
  }

  return null;
};

exports.getQueueLength = guild => {
  let player = connections[guild.id];
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

exports.songTimeLeft = (guild, min, sec) => {
  let player = connections[guild.id];
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

exports.getVolume = guild => {
  let player = connections[guild.id];
  if (player) return player.volume;
  return null;
};

exports.setVolume = (guild, volume) => {
  let player = connections[guild.id];
  if (player) {
    player.volume = volume;
    if (player.dispatcher) player.dispatcher.setVolume(player.volume / 50);
  }
};

exports.startTimeout = guild => {
  let player = connections[guild.id];
  console.log(`Starting music timeout for ${guild.name}`);
  player.timeout = setTimeout(() => {
    player.tChannel.sendMessage("Disconnecting from voice due to voice channel inactivity.");
    player.vChannel.connection.disconnect();
  }, 300000);
};

exports.cancelTimeout = guild => {
  let player = connections[guild.id];
  if (player && player.timeout) {
    clearTimeout(player.timeout);
    player.timeout = null;
  }
};
