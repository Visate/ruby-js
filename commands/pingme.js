// Pingme command
exports.help = {
  name: "pingme",
  description: "Mentions you with an optional message",
  extendedhelp: "Mentions you with an optional message. Useful for reminders maybe?"
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  msg.channel.sendMessage(`${msg.author} ${suffix}`);
};
