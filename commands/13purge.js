// Purge command

exports.help = {
  name: "purge",
  usage: "<number of messages>",
  description: "Deletes a certain amount of messages.",
  extendedhelp: `Deletes a number of messages from the chat. Maximum is 100 messages. Use with caution.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  alternateInvoke: true,
  aliases: ["clear", "delete", "prune"],
  permLevel: 6
};

exports.run = (client, msg, suffix) => {
  let delCount = 0;
  if (!suffix || isNaN(suffix)) return msg.channel.sendMessage("Please define an amount of messages for me to delete~").then(m => m.delete(5000));
  delCount = parseInt(suffix, 10);

  if (delCount < 0) return msg.channel.sendMessage("I cannot delete a negative number of messages!").then(m => m.delete(5000));
  if (delCount > 100) return msg.channel.sendMessage(`Sorry, I cannot delete more than 100 messages >///<`).then(m => m.delete(5000));
  else if (delCount > 0) {
    msg.channel.fetchMessages({limit: delCount, before: msg.id}).then(msgs => {
      msgs.forEach(m => {
        m.delete();
      });
    });
    msg.delete();
  }
};
