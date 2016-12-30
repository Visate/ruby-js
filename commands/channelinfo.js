// channelinfo command
const moment = require("moment");

exports.help = {
  name: "channelinfo",
  description: "Displays information about this channel.",
  extendedhelp: "Displays information about this channel."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["channel-info", "cinfo", "c-info", "topic"],
  permLevel: 0
};

exports.run = (bot, msg) => {
  let channel = msg.channel;
  let embed = {
    color: 3447003,
    author: {
      name: `#${channel.name} (ID: ${channel.id})`
    },
    fields: [
      {
        name: "❯ Position",
        value: channel.position,
        inline: true
      },
      {
        name: "❯ Created At",
        value: moment(channel.createdAt).format("ddd, MMM DD YYYY [at] HH:mm:ss [UTC]"),
        inline: true
      },
      {
        name: "❯ Topic",
        value: channel.topic
      }
    ],
    footer: {
      text: "Channel Info",
      icon_url: bot.user.avatarURL
    }
  };

  channel.sendEmbed(embed);
};
