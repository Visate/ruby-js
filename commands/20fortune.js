// fortune command
const fortunes = require("../lists/fortunes.json");
const ids = Object.keys(fortunes);

exports.help = {
  name: "fortune",
  description: "Sends a random fortune.",
  extendedhelp: "Sends a random fortune."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["cookie", "fortunecookie"],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  msg.reply(fortunes[ids[Math.floor(Math.random() * ids.length)]]);
};
