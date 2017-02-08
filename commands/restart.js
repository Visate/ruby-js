// Restart command
exports.help = {
  name: "restart",
  description: "Restarts the bot.",
  extendedhelp: "Restarts the bot by sending an exit code. Needs to be launched with forever in order to work."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 8
};

exports.run = (bot, msg) => {
  msg.channel.sendMessage("Be right back~ :heart:").then(() => process.exit(0));
};
