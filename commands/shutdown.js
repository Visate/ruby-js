// Shutdown command
exports.help = {
  name: "shutdown",
  description: "Shuts down the bot.",
  extendedhelp: "Shuts down the bot by sending a specific exit code (if running with forever)."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 8
};

exports.run = (bot, msg) => {
  msg.channel.sendMessage("Bye bye!~ :heart:").then(() => process.exit(21));
};
