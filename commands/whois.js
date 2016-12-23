// Whois command
const moment = require("moment");
const stripIndents = require("common-tags").stripIndents;
const config = require("../config.json");
const createID = require("../scripts/createid.js");

exports.help = {
  name: "whois",
  usage: "[user]",
  description: "Displays information about a user.",
  extendedhelp: "Displays information about a user. Can be run without a user query (displays you), a username or nickname search, user ID or a mention (not recommended)."
};

exports.config = {
  enabled: true,
  guildOnly: false,
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
    let msgArray = [];
    msgArray.push(`Multiple users were found with that search, run the command with \`${config.settings.prefix}whois <id>\``);
    members.forEach(m => {
      let userMsg = m.nickname ? `**${m.user.username} (${m.nickname}):** ${m.id}` : `**${m.user.username}:** ${m.id}`;
      msgArray.push(userMsg);
    });

    msg.channel.sendMessage(msgArray);
  }

  else if (members.length === 1 && members[0] !== null && members[0] !== undefined) {
    let member = members[0];
    let randomID = createID();

    let details = stripIndents`
    • User:                  \`${member.user.username}#${member.user.discriminator} ${member.nickname ? `(${member.nickname})` : ""}\`
    • ID:                      \u200A${member.id}
    • Roles:                \u2009${member.roles.map(r => `\`${r.name}\``).join(" ")}
    • Date Joined:    \u2006${member.joinedAt.toUTCString()}
    • Status:              \u2006${member.presence.status === "dnd" ? "Do Not Disturb" : member.presence.status.charAt(0).toUpperCase() + member.presence.status.slice(1)}
    ${member.presence.game ? `${member.presence.game.streaming ? `• Streaming:       \u200A[${member.presence.game.name}](${member.presence.game.url})` : `• Playing:             ${member.presence.game.name}`}` : randomID}
    \u200b
    `;

    details = details.replace(`\n${randomID}`, "");  // correct spacing if there is no game

    let mesg = {
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

    msg.channel.sendMessage("", { embed: mesg });
  }

  else msg.channel.sendMessage("No users were found with that search!");
};
