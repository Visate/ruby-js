// Whois command
const stripIndents = require("common-tags").stripIndents;
const config = require("../config.json");

exports.help = {
  name: "whois",
  usage: "[user]",
  description: "Displays information about a user.",
  extendedhelp: "Displays information about a user. Can be run without a user query (displays you), a username or nickname search, user ID or a mention (not recommended)."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["userinfo"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let memberList = msg.guild.members;
  let members = [];

  if (!suffix) members.push(msg.member);

  else if (suffix) {

    if (suffix.startsWith("<@!")) {
      suffix = suffix.substring(3, suffix.length - 1);
      msg.channel.sendMessage(`${msg.author}, you don't need to mention someone in order to use this command! Please avoid that next time~`);
    }
    else if (suffix.startsWith("<@")) {
      suffix = suffix.substring(2, suffix.length - 1);
      msg.channel.sendMessage(`${msg.author}, you don't need to mention someone in order to use this command! Please avoid that next time~`);
    }

    if (isNaN(suffix)) {
      suffix = suffix.toLowerCase();
      let names = memberList.filter(m => m.user.username.toLowerCase().includes(suffix));
      let nicks = memberList.filter(m => m.nickname !== null && m.nickname.toLowerCase().includes(suffix));
      let ids = [];

      names.forEach(m => {
        members.push(m);
        ids.push(m.id);
      });

      nicks.forEach(m => {
        if (ids.includes(m.id)) return;
        members.push(m);
      });
    }

    else members.push(memberList.get(suffix));
  }

  if (members.length > 1) {
    let idsInfo = stripIndents`
    Multiple users were found with that search, run the command with \`${config.settings.prefix}whois <id>\`
    ${members.map(m => `**${m.user.username}${m.nickname ? ` (${m.nickname})` : ""}:** ${m.id}`).join("\n")}
    `;

    msg.channel.sendMessage(idsInfo);
  }

  else if (members.length === 1 && members[0]) {
    let member = members[0];

    let details = stripIndents`
    • User:                  \`${bot.cleanText(`${member.user.username}#${member.user.discriminator} ${member.nickname ? `(${member.nickname})` : ""}`)}\`
    • ID:                      \u200A${member.id}
    • Roles:                \u2009${member.roles.map(r => `\`${bot.cleanText(r.name)}\``).join(" ")}
    • Date Joined:    \u2006${member.joinedAt.toUTCString()}
    • Status:              \u2006${member.presence.status === "dnd" ? "Do Not Disturb" : member.presence.status.charAt(0).toUpperCase() + member.presence.status.slice(1)}
    ${member.presence.game ? `${member.presence.game.streaming ? `• Streaming:       \u200A[${member.presence.game.name}](${member.presence.game.url})` : `• Playing:             ${member.presence.game.name}`}\n\u200b` : "\u200b"}
    `;

    let embed = {
      color: 3447003,
      author: {
        name: `${member.user.username}#${member.user.discriminator} (${member.id})`,
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
        text: "Whois",
        icon_url: bot.user.avatarURL
      }
    };

    msg.channel.sendEmbed(embed);
  }

  else msg.channel.sendMessage("No users were found with that search!");
};
