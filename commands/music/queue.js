// queue command

exports.help = {
  name: "queue",
  usage: "[page number]",
  description: "Displays the upcoming songs.",
  extendedhelp: "Displays the upcoming songs. Can be used with a number (if necessary) to display more entries by changing pages."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["q", "np", "playing"],
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  let player = client.util.musicHandler.getPlayer(msg.guild);
  if (player) {
    let queueMsg;
    let milliSec = player.dispatcher.time;
    let totalSec = ~~(milliSec / 1000);

    if (player.streaming) {
      queueMsg = client.util.commonTags.stripIndents`
      __**Now streaming:**__
      ${player.stream.np()} from [${player.stream.name}](${player.stream.queueUrl})

      **Total streaming time:** ${client.util.toHHMMSS(totalSec)}
      \u200b
      `;
    }

    else if (player.playing) {
      if (isNaN(suffix) || suffix === "") suffix = 1;
      let maxPages = Math.ceil(player.queue.length / 10);
      if (suffix < 1) suffix = 1;
      if (suffix > maxPages) suffix = maxPages;
      let startingIndex = (parseInt(suffix, 10) - 1) * 10;
      let currentSong = player.queue[0];
      if (!currentSong) return msg.channel.sendMessage("There's nothing playing right now!");

      queueMsg = client.util.commonTags.stripIndents`
      __**Song queue for ${player.voice.name}, page ${suffix}**__
      ${player.queue.slice(startingIndex, startingIndex + 10).map(song => `**-** ${song.queueURL ? `[${song.title}](${song.queueURL})` : `**${song.title}**`} requested by **${song.requestedBy}** (${song.length === "unknown" ? "?:??" : client.util.toHHMMSS(song.length)})`).join("\n")}
      ${maxPages > 1 ? `\nUse \`${client.config.prefix}music queue <page>\` to view a specific page.\n` : ""}

      **Now playing:** ${currentSong.queueURL ? `[${currentSong.title}](${currentSong.queueURL})` : currentSong.title}
      **Progress:** ${player.dispatcher.paused ? "Paused: " : ""}${client.util.toHHMMSS(totalSec)} / ${client.util.toHHMMSS(currentSong.length)} (${player.timeRemaining()} left)
      **Total queue time:** ${player.getQueueLength()}${player.looping ? `\n**Looping ${player.queue.length} songs**` : ""}
      \u200b
      `;
    }

    if (queueMsg) return msg.channel.sendEmbed({
      color: 3447003,
      author: {
        name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
        icon_url: msg.author.avatarURL
      },
      description: queueMsg,
      footer: {
        text: "Music Queue",
        icon_url: client.user.avatarURL
      }
    });
    else return msg.channel.sendMessage("There's nothing playing right now!");
  }
};
