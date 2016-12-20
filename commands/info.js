// Introduce command
const config = require("../config.json");
const stripIndents = require("common-tags").stripIndents;

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
  let totalSec = bot.uptime / 1000;
  let mins = ~~(totalSec / 60);
  let secs = ~~(totalSec % 60);
  let text = stripIndents`
  Hello, I'm ${bot.user.username}! It's a pleasure to meet you ^-^
  If you want to see what I can do, use \`${config.settings.prefix}help\`
  If you have any questions, feel free to ask my creator Visate#7752 :blush:
  \`\`\`asciidoc
  = Statistics =
  
  ★ Library      :: discord.js
  ★ Mem Usage    :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
  ★ Uptime       :: ${mins}:${secs}
  ★ Users        :: ${bot.users.size}
  ★ Servers      :: ${bot.guilds.size}
  ★ Channels     :: ${bot.channels.size}
  \`\`\``;

  msg.channel.sendMessage(text)
};
