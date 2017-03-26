// joke command
const jokes = require("../lists/jokes.json");
const ids = Object.keys(jokes);

exports.help = {
  name: "joke",
  description: "Sends a random joke.",
  extendedhelp: "Sends a random joke."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  msg.reply(jokes[ids[Math.floor(Math.random() * ids.length)]]);
};
