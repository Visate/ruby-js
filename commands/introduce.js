// Introduce command
var config = require("../config.json");

exports.help = {
  name: "introduce",
  description: "Sends some information about myself",
  extendedhelp: "Tells you a little bit of information about myself"
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["intro"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let msgArray = [];
  msgArray.push(`Hello, I'm ${bot.user.username}! It's a pleasure to meet you ^-^`);
  msgArray.push(`If you want to see what I can do, use \`${config.settings.prefix}help\``);
  msgArray.push(`If you have any questions, feel free to ask my creator Visate :blush:`);
  msg.channel.sendMessage(msgArray);
};
