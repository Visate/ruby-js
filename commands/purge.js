// Purge command
var config = require("../config.json");
var msgsCount = 0;

exports.help = {
  name: "purge",
  usage: "<number of messages>",
  description: "Deletes a certain amount of messages.",
  extendedhelp: `Deletes a number of messages from the chat. Maximum is ${config.settings.maxPurge} messages. Use with caution.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["clear", "delete", "prune"],
  permLevel: 6
};

exports.run = (bot, msg, suffix) => {
  let channel = msg.channel;
  if (!suffix || isNaN(suffix)) return channel.sendMessage("Please define an amount of messages for me to delete~").then(mesg => mesg.delete(5000));
  msgsCount = parseInt(suffix, 10);

  if (suffix > config.settings.maxPurge) return channel.sendMessage(`Sorry, I cannot delete more than ${config.settings.maxPurge} messages >///<`).then(mesg => mesg.delete(5000));
  else if (suffix > 100) {
    let collector = channel.createCollector(m => m.author === msg.author, {time: 30000});
    channel.sendMessage(`You are about to delete ${msgsCount} messages. Once this starts, it cannot be stopped. Are you sure you want to continue? (yes/no)`);

    collector.on("message", message => {
      if (message.content === "yes") collector.stop("delete");
      else if (message.content === "no") collector.stop("abort");
    });

    collector.on("end", (collection, reason) => {
      if (reason === "abort") return channel.sendMessage("Cancelled~");
      else if (reason === "time") return channel.sendMessage("Time's up! Purge cancelled~");
      else if (reason === "delete") {
        msgsCount += 2;
        let lastmsg = collection.last();
        delMsgs(lastmsg.id, channel);
        lastmsg.delete();
      }
    });
  }
  else if (suffix > 0) {
    msg.delete().then(m => m.channel.bulkDelete(suffix));
  }
};

function delMsgs(id, channel) {
  // Recursively deleting more than 100 messages
  // Can only be done 100 messages at a time
  let delCount = 0;
  if (msgsCount > 100) {
    msgsCount -= 100;
    delCount = 100;
  }

  else if (msgsCount > 0 && msgsCount <= 100) {
    delCount = msgsCount;
    msgsCount = 0;
  }

  // Deleting the messages and then recursively running again
  if (delCount > 0) {
    channel.fetchMessages({limit: delCount, before: id}).then(msgs => {
      channel.bulkDelete(msgs).then(() => delMsgs(msgs.last().id, channel));
    });
  }
}
