// pickup command
const pickupLines = require("../lists/pickuplines.json");
const ids = Object.keys(pickupLines);

exports.help = {
  name: "pickup",
  description: "Sends a random pickup line.",
  extendedhelp: "Sends a random pickup line."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  msg.reply(pickupLines[ids[Math.floor(Math.random() * ids.length)]]);
};
