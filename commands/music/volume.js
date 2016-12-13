exports.help = {
  name: "volume",
  usage: "[volume]",
  description: `Shows the current volume or changes it.`,
  extendedhelp: `Shows the current volume. If a number is provided, changes the volume to that number (max 100).`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["vol", "v"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  // placeholder
};
