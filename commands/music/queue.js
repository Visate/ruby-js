// queue command
const stripIndents = require("common-tags").stripIndents;
const config = require("../../config.json");

exports.help = {
  name: "queue",
  usage: "[page number]",
  description: "Displays the upcoming songs.",
  extendedhelp: "Displays the upcoming songs. Can be used with a number (if necessary) to display more entries by changing pages."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["q"],
  permLevel: 0
};

exports.run = (bot, msg, suffix = 1) => {
  let player = bot.musicHandler.getPlayer(msg.guild);
  if (player) {
    let queueMsg;
    let milliSec = player.dispatcher.time;
    let totalSec = ~~(milliSec / 1000);
    let min = ~~(totalSec / 60);
    let sec = totalSec % 60;
    if (sec < 10) sec = `0${sec}`;

    if (player.streaming) {
      queueMsg = stripIndents`
      __**Now streaming:**__
      ${player.stream.np()} from [${player.stream.name}](${player.stream.queueUrl})

      **Total streaming time:** ${min}:${sec}
      `;
    }

    else if (player.playing) {
      if (isNaN(suffix)) suffix = 1;
      let maxPages = Math.ceil(player.queue.length / 10);
      if (suffix > maxPages) suffix = maxPages;
      let startingIndex = (parseInt(suffix, 10) - 1) * 10;
      let currentSong = player.queue[0];
      if (!currentSong) return msg.channel.sendMessage("There's nothing playing right now!");

      queueMsg = stripIndents`
      __**Song queue, page ${suffix}**__
      ${player.queue.slice(startingIndex, startingIndex + 10).map(song => `**-** ${song.queueUrl ? `[${song.title}](${song.queueUrl})` : song.title} (${song.length === "unknown" ? "?:??" : song.length})`).join("\n")}
      ${maxPages > 1 ? `\nUse \`${config.settings.prefix}music queue <page>\` to view a specific page.\n` : ""}

      **Now playing:** ${currentSong.queueUrl ? `[${currentSong.title}](${currentSong.queueUrl})` : currentSong.title}
      **Progress:** ${player.dispatcher.paused ? "Paused: " : ""}${min}:${sec} / ${currentSong.length} (${bot.musicHandler.songTimeLeft(msg.guild, min, sec)} left)
      **Total queue time:** ${bot.getQueueLength(msg.guild)}
      `;
    }

    if (queueMsg) return msg.channel.sendEmbed(queueMsg);
    else return msg.channel.sendMessage("There's nothing playing right now!");
  }
};
