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
    if (typeof evaled !== "string") evaled = require('util').inspect(evaled);
    msg.channel.sendMessage(`\`\`\`x1\n${bot.cleanText(evaled)}\n\`\`\``);
  } catch (err) {
    msg.channel.sendMessage(`\`\`\`x1\nError: ${bot.cleanText(err)}\n\`\`\``);
  }
};
