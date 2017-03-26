// salty command
const salty = require("../lists/salty.json");
const ids = Object.keys(salty);

exports.help = {
  name: "salty",
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
  msg.reply(salty[ids[Math.floor(Math.random() * ids.length)]]);
};
