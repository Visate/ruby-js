// Say command
exports.help = {
  name: "say",
  usage: "<message>",
  description: "Sends message to chat.",
  extendedhelp: "Sends a message to the chat as the bot. Works best when bot can delete the invoking message!"
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["speak"],
  permLevel: 8
};

exports.run = (client, msg, suffix) => {
  let channel = msg.channel;
  msg.delete();
  channel.sendMessage(suffix);
};
