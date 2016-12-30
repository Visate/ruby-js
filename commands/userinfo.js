// Whois command
const stripIndents = require("common-tags").stripIndents;
const moment = require("moment");
const config = require("../config.json");

exports.help = {
  name: "userinfo",
  usage: "[user]",
  description: "Displays information about a user.",
  extendedhelp: "Displays information about a user. Can be run without a user query (displays you), a username or nickname search, user ID or a mention (not recommended)."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["whois"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let member;

  if (!suffix) member = msg.member;

  else if (suffix) {
    if (suffix.startsWith("<@!")) {
      member = msg.guild.members.get(suffix.slice(3, -1));
      msg.channel.sendMessage(`${msg.author}, you don't need to mention someone in order to use this command! Please avoid that next time~`);
    }
    else if (suffix.startsWith("<@")) {
      member = msg.guild.members.get(suffix.slice(2, -1));
      msg.channel.sendMessage(`${msg.author}, you don't need to mention someone in order to use this command! Please avoid that next time~`);
    }

    else {
      let query = suffix.toLowerCase();
      let members = msg.guild.members.filter(m => m.user.username.toLowerCase().includes(query) || (m.nickname && m.nickname.toLowerCase().includes(query)));

      if (members.size > 1) {
        return msg.channel.sendMessage(stripIndents`
          Multiple users were found with that search, run the command with \`${config.settings.prefix}whois <id>\`
          ${members.map(m => `**${m.user.username}#${m.user.discriminator}${m.nickname ? ` (${m.nickname})` : ""}:** ${m.id}`).join("\n")}
        `);
      }
      else if (members.size === 1) member = members.first();
    }
  }

  if (!member) return msg.channel.sendMessage("No users were found with that search!");

  let details = stripIndents`
  ⭑ User:                  \`${bot.cleanText(`${member.user.username}#${member.user.discriminator} ${member.nickname ? `(${member.nickname})` : ""}`)}\`
  ⭑ ID:                      \u200A${member.id}
  ⭑ Roles:                \u2009${member.roles.map(r => `\`${bot.cleanText(r.name)}\``).join(" ")}
  ⭑ Date Joined:    \u2006${moment(member.joinedAt).format("ddd, MMM DD YYYY [at] HH:mm:ss [UTC]")}
  ⭑ Status:              \u2006${member.presence.status === "dnd" ? "Do Not Disturb" : member.presence.status.charAt(0).toUpperCase() + member.presence.status.slice(1)}
  ${member.presence.game ? `${member.presence.game.streaming ? `⭑ Streaming:       \u200A[${member.presence.game.name}](${member.presence.game.url})` : `⭑ Playing:             ${member.presence.game.name}`}\n\u200b` : "\u200b"}
  `;

  let embed = {
    color: 3447003,
    author: {
      name: `${member.user.username}#${member.user.discriminator} (ID: ${member.id})`,
      icon_url: member.user.avatarURL
    },
    fields: [
      {
        name: "❯ Member Details",
        value: details
      }
    ],
    thumbnail: {
      url: member.user.avatarURL
    },
    footer: {
      text: "User Info",
      icon_url: bot.user.avatarURL
    }
  };

  msg.channel.sendEmbed(embed);
};
