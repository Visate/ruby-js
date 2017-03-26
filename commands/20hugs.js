// hugs command
const hugs = require("../lists/hugs.json");
const ids = Object.keys(hugs);

exports.help = {
  name: "hugs",
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
  msg.reply(hugs[ids[Math.floor(Math.random() * ids.length)]]);
};
