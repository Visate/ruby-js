// lies command
const lies = require("../lists/lies.json");
const ids = Object.keys(lies);

exports.help = {
  name: "lies",
  description: "Sends a random hug.",
  extendedhelp: "Sends a random hug."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  msg.reply(lies[ids[Math.floor(Math.random() * ids.length)]]);
};
