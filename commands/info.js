// Introduce command
var config = require("../config.json");

exports.help = {
  name: "info",
  description: "Sends some information about myself.",
  extendedhelp: "Tells you a little bit of information about myself."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["introduce", "stats", "statistics"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let msgArray = [];
  msgArray.push(`Hello, I'm ${bot.user.username}! It's a pleasure to meet you ^-^`);
  msgArray.push(`If you want to see what I can do, use \`${config.settings.prefix}help\``);
  msgArray.push(`If you have any questions, feel free to ask my creator Visate :blush:`);
  msgArray.push("```");
  msgArray.push(`Statistics:`);
  msgArray.push(`★ Mem Usage    : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
  let totalSec = bot.uptime / 1000;
  let mins = ~~(totalSec / 60);
  let secs = ~~(totalSec % 60);
  msgArray.push(`★ Uptime       : ${mins}:${secs}`);
  msgArray.push(`★ Users        : ${bot.users.size}`);
  msgArray.push(`★ Servers      : ${bot.guilds.size}`);
  msgArray.push(`★ Channels     : ${bot.channels.size}`);
  msgArray.push("```");
  msg.channel.sendMessage(msgArray);
};
