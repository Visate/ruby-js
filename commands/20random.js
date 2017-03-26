// random command
const randomLines = require("../lists/randomlines.json");
const ids = Object.keys(randomLines);

exports.help = {
  name: "random",
  description: "Sends a random line.",
  extendedhelp: "Sends a random line."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  msg.reply(randomLines[ids[Math.floor(Math.random() * ids.length)]]);
};
