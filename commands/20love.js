// love command
const loveLines = require("../lists/lovelines.json");
const ids = Object.keys(loveLines);

exports.help = {
  name: "love",
  description: "Sends a random love line.",
  extendedhelp: "Sends a random love line."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  msg.reply(loveLines[ids[Math.floor(Math.random() * ids.length)]]);
};
