exports.help = {
  name: "volume",
  usage: "[volume]",
  description: "Shows the current volume or changes it.",
  extendedhelp: "Shows the current volume. If a number is provided, changes the volume to that number (max 100)."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["vol"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let player = bot.musicHandler.getPlayer(bot, msg.guild);
  let volumeQuery = Math.round(parseInt(suffix), 10);
  if (player) {
    if (bot.musicHandler.checkDJ(bot, msg) && !isNaN(volumeQuery)) {
      if (volumeQuery > 100) volumeQuery = 100;
      if (volumeQuery < 0) volumeQuery = 0;
      bot.musicHandler.setVolume(bot, msg.guild, volumeQuery);
    }
    let currentVolume = bot.musicHandler.getVolume(bot, msg.guild);
    msg.channel.sendMessage(`Volume: ${currentVolume} [${volumeBar(currentVolume / 5)}]`);
  }
};

function volumeBar(number) {
  let filled = "▓";
  let unfilled = "░";
  let volumeBar = Array(number + 1).join(filled) + Array(21 - number).join(unfilled);
  return volumeBar;
}
