// Ping command
exports.help = {
  name: "ping",
  description: "Pong!",
  extendedhelp: "Ping/Pong command. I wonder what this does?"
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  msg.channel.sendMessage('Ping?')
    .then(message => {
      message.edit(`Pong! (took: ${message.createdTimestamp - msg.createdTimestamp}ms)`);
    });
};
