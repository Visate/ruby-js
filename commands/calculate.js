// calculate command
const mathjs = require("mathjs");

exports.help = {
  name: "calculate",
  usage: "<expression>",
  description: "Tries to calculate a given math expression.",
  extendedhelp: "Attempts to calculate a given math expression then returns the result."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["math", "evaluate"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  if (!suffix) return msg.channel.sendMessage("Please provide a math statement to calculate~");

  try {
    msg.channel.sendMessage(`${suffix} --> ${mathjs.eval(suffix)}`);
  } catch (err) {
    msg.channel.sendMessage(`${suffix} --> ${err}`);
  }
};
