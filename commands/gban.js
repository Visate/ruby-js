// Gban command
const stripIndents = require("common-tags").stripIndents;
const config = require("../config.json");

exports.help = {
  name: "gban",
  usage: "<user> <reason>",
  description: "Globally bans a user across all servers and logs it.",
  extendedhelp: "Globally bans a user across all servers and logs it. They are PM'd with the reason and a link to the appeal form. Include a reason in the command!"
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 6
};

exports.run = (bot, msg, suffix) => {
  let originGuild = msg.guild;
  let originChannel = msg.channel;

  let userQuery = suffix.split(" ")[0];
  let reason = suffix.substring(userQuery.length + 1);

  if (userQuery.startsWith("<@!")) userQuery = userQuery.substring(3, userQuery.length - 1);
  else if (userQuery.startsWith("<@")) userQuery = userQuery.substring(2, userQuery.length - 1);

  if (!suffix) return msg.channel.sendMessage(`${msg.author}, please provide a user ID or mention and a reason~`).then(m => m.delete(5000));
  if (isNaN(userQuery)) return msg.channel.sendMessage(`${msg.author}, please provide a valid user ID or mention~`).then(m => m.delete(5000));
  if (reason === "") return msg.channel.sendMessage(`${msg.author}, please include a reason in your report~`).then(m => m.delete(5000));

  let user;
  let pmStatus = false;

  originGuild.fetchBans().then(bans => {
    user = bans.get(userQuery);
    if (!user) user = originGuild.members.has(userQuery) ? originGuild.members.get(userQuery).user : {username: "?", discriminator: "?", id: userQuery, placeholder: true};
    if (!user.placeholder) pmStatus = messageUser(user, msg, reason);
    processGban(bot, msg, originGuild, originChannel, user, reason, pmStatus).then((bannedUser, count) => {
      msg.channel.sendMessage(`${msg.author}, ${bannedUser.username} (${bannedUser.id}) was banned across ${count} servers ^-^`);
    }).catch((bannedUser, count, countNoBan) => {
      msg.channel.sendMessage(`${msg.author}, ${bannedUser.username} (${bannedUser.id}) was banned across ${count - countNoBan} servers ^-^ (failed on ${countNoBan} servers)`);
    });
  });
};

function messageUser(user, msg, reason) {
  let msgPM = stripIndents`
  Oh no! It appears that you have been global banned by ${msg.author.username}.
  **Reason:** ${reason}

  If you feel that this was unjust, feel free to appeal your ban using the form linked below~ :heart:
  ${config.resources.banForm}
  `;

  user.sendMessage(msgPM).then(() => {
    return true;
  }).catch(() => {
    return false;
  });
}

function processGban(bot, msg, originGuild, originChannel, user, reason, pmStatusInit) {
  let count = 0;
  let countNoBan = 0;
  let pmStatus = pmStatusInit;

  return new Promise((resolve, reject) => {
    bot.guilds.forEach(guild => {
      if (guild.id === "235144885101920256") return; // exempt testing server
      let rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");

      let caseNum;
      rubyLogCh.fetchMessages({limit: 1}).then(msgs => {
        let pastCase = msgs.array()[0];
        if (msgs.size === 0) caseNum = 1;
        else if (pastCase.embeds.length === 0) {
          let caseTxt = pastCase.content.split("\n")[0];
          caseNum = parseInt(caseTxt.substring(21, caseTxt.indexOf(" |")), 10) + 1;
        }
        else if (pastCase.embeds.length > 0) {
          let caseTxt = pastCase.embeds[0].footer.text;
          caseNum = parseInt(caseTxt.substring(5), 10) + 1;
        }
        if (isNaN(caseNum)) caseNum = 1;

        guild.ban(user.id, 1).then(bannedUser => {
          if (user.username === "?" && user.discriminator === "?") {
            if (typeof bannedUser !== "string") {
              user = bannedUser.user ? bannedUser.user : bannedUser;
              if (!pmStatus) pmStatus = messageUser(user, msg, reason);
            }
          }

          let logDetails = stripIndents`
          **Action:**          Global Ban
          **Origin:**          ${originGuild.name}
          **Channel:**       ${originChannel.name}
          **User:**             ${user.username}#${user.discriminator} (${user.id})
          **Reason:**        ${reason}
          \u200b
          `;

          let logMsg = {
            color: 16723762,
            author: {
              name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
              icon_url: msg.author.avatarURL
            },
            description: logDetails,
            footer: {
              icon_url: bot.user.avatarURL,
              text: `Case ${caseNum}`
            }
          };

          rubyLogCh.sendMessage("", {embed: logMsg});
          count++;

          if (count === bot.guilds.size - 1 && countNoBan === 0) resolve(user, count);
          else if (count === bot.guilds.size - 1 && countNoBan > 0) reject(user, count, countNoBan);
        }).catch(() => {
          count++;
          countNoBan++;

          if (count === bot.guilds.size - 1 && countNoBan === 0) resolve(user, count);
          else if (count === bot.guilds.size - 1 && countNoBan > 0) reject(user, count, countNoBan);
        });
      });
    });
  });
}
