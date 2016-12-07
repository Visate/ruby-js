// Eval command
exports.help = {
  name: "eval",
  usage: "<expression>",
  description: "Runs arbitrary Javascript.",
  extendedhelp: "Runs arbitrary Javascript code and returns the output. Expression may contain multiple lines, reserved for bot master."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["ev", "debug"],
  permLevel: 8
};

exports.run = (bot, msg, suffix) => {
  try {
    let evaled = eval(suffix);
    let result = msg.channel.sendCode("x1", bot.cleanText(evaled));
  } catch (err) {
    msg.channel.sendCode("x1", `Error: ${bot.cleanText(err)}`);
  }
};
