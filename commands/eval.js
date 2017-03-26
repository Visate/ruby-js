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

exports.run = (client, msg, suffix) => {
  try {
    let evaled = eval(suffix);
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    msg.channel.sendMessage(`\`\`\`x1\n${client.util.cleanText(evaled)}\n\`\`\``, {split : {prepend: "```x1\n", append: "\n```"}});
  } catch (err) {
    msg.channel.sendCode("x1", `Error: ${client.util.cleanText(err)}`);
  }
};
