const ytdl = require("ytdl-core");
const request = require("request");
const config = require("../../config.json");

exports.help = {
  name: "play",
  usage: "<URL|search>",
  description: "Adds a song to the queue. Can be YouTube/SoundCloud URL or search.",
  extendedhelp: "Adds a song to the music queue, and if nothing is already playing, starts playback. You may send either a YouTube/SoundCloud URL or a search query which will search on YouTube."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["p"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let permLvl = bot.checkPerms(msg);
  if (!bot.musicHandler.checkDJ(bot, msg)) return;

  if (suffix.includes("http")) {
    if (suffix.search(/<http.+>/) !== -1) suffix = suffix.slice(1, -1);
    if (suffix.includes("youtube") || suffix.includes("youtu.be")) {
      // Youtube streaming
      ytdl.getInfo(suffix, (err, info) => {
        if (err) return msg.channel.sendMessage(`Error occured on adding song: ${err}`);

        let totalSec = parseInt(info["length_seconds"], 10);
        let min = ~~(totalSec / 60);
        let sec = totalSec % 60;
        if (sec < 10) sec = `0${sec}`;

        bot.musicHandler.addToQueue(msg, info["title"], `${min}:${sec}`, suffix, suffix, "youtube");
      });
    }

    else if (suffix.includes("soundcloud")) {
      // Soundcloud streaming
      request(`https://api.soundcloud.com/resolve?url=${suffix}&client_id=${config.apiKeys.soundcloudId}`, (error, response, body) => {
        if (error) return msg.channel.sendMessage(`Error occured on adding song: ${error}`);
        else if (!error && response.statusCode === 200) {
          let info = JSON.parse(body);
          let milliSec = parseInt(info["duration"], 10);
          let totalSec = ~~(milliSec / 1000);
          let min = ~~(totalSec / 60);
          let sec = totalSec % 60;
          if (sec < 10) sec = `0${sec}`;

          bot.musicHandler.addToQueue(msg, info["title"], `${min}:${sec}`, info["permalink_url"], `${info["stream_url"]}?client_id=${config.apiKeys.soundcloudId}`, "soundcloud");
        }
      });
    }

    else if (permLvl > 4) {
      // attempt any link streaming
      bot.musicHandler.addToQueue(msg, suffix, "unknown", suffix, suffix, "other");
    }
  }

  else {
    // youtube search

  }
};
