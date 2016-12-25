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
  aliases: ["introduce", "stats", "statistics", "uptime"],
  permLevel: 0
};

exports.run = (bot, msg) => {
  let hours = ~~(bot.uptime / 3600000) % 24;
  let minutes = ~~(bot.uptime / 60000) % 60;
  let seconds = ~~(bot.uptime / 1000) % 60;
  let embed = {
    color: 3447003,
    description: stripIndents`
    Hello, I'm ${bot.user.username}! It's a pleasure to meet you ^-^
    If you want to see what I can do, use \`${config.settings.prefix}help\`
    If you have any questions, feel free to ask my creator <@97198953430257664> :blush:

    **${bot.user.username} Statistics**
    `,
    fields: [
      {
        name: "❯ Library",
        value: "discord.js",
        inline: true
      },
      {
        name: "❯ Memory Usage",
        value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        inline: true
      },
      {
        name: "❯ General Info",
        value: stripIndents`
        ★ Guilds: ${bot.guilds.size}
        ★ Channels: ${bot.channels.size}
        ★ Users: ${bot.users.size}
        `,
        inline: true
      },
      {
        name: "❯ Uptime",
        value: `${hours} ${hours === 1 ? "hour" : "hours"}, ${minutes} ${minutes === 1 ? "minute" : "minutes"} and ${seconds} ${seconds === 1 ? "second" : "seconds"}`,
        inline: true
      }
    ],
    thumbnail: {
      url: bot.user.avatarURL
    },
    footer: {
      text: "Info",
      icon_url: bot.user.avatarURL
    }
  };


  msg.channel.sendEmbed(embed);
};
