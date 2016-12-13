exports.help = {
  name: "leave",
  description: `Disconnects the bot from the voice channel.`,
  extendedhelp: `Disconnects the bot from the voice channel. All info is cleared in the process.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["l", "disconnect"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  // placeholder
};
