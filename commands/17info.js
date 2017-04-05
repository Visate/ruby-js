// Introduce command

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

exports.run = (client, msg) => {
  let embed = {
    color: 3447003,
    author: {
      name: `${client.user.username}#${client.user.discriminator} (ID: ${client.user.id})`,
      icon_url: `${client.user.avatarURL}`
    },
    description: client.util.commonTags.stripIndents`
    Hello, I'm ${client.user.username}! It's a pleasure to meet you ^-^
    If you want to see what I can do, use \`${client.config.prefix}help\`
    If you have any questions, feel free to ask my creator <@97198953430257664> :blush:

    **${client.user.username} Statistics**
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
        value: client.util.commonTags.stripIndents`
        ⭑ Guilds: ${client.guilds.size}
        ⭑ Channels: ${client.channels.size}
        ⭑ Users: ${client.users.size}
        `,
        inline: true
      },
      {
        name: "❯ Uptime",
        value: client.util.toHHMMSS(client.uptime / 1000),
        inline: true
      }
    ],
    thumbnail: {
      url: client.user.avatarURL
    },
    footer: {
      text: "Info",
      icon_url: client.user.avatarURL
    }
  };


  msg.channel.sendEmbed(embed);
};
