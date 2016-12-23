// Gban command
const stripIndents = require("common-tags").stripIndents;

exports.help = {
  name: "gunban",
  usage: "<user> <reason>",
  description: "Globally unbans a user across all servers and logs it.",
  extendedhelp: "Globally unbans a user across all servers and logs it. Include a reason in the command!"
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 6
};

exports.run = (bot, msg, suffix) => {
  let originGuild = msg.guild;

  let userQuery = suffix.split(" ")[0];
  let reason = suffix.substring(userQuery.length + 1);

  if (userQuery.startsWith("<@!")) userQuery = userQuery.substring(3, userQuery.length - 1);
  else if (userQuery.startsWith("<@")) userQuery = userQuery.substring(2, userQuery.length - 1);

  if (!suffix) return msg.channel.sendMessage(`${msg.author}, please provide a user ID or mention and a reason~`).then(m => m.delete(5000));
  if (isNaN(userQuery)) return msg.channel.sendMessage(`${msg.author}, please provide a valid user ID or mention~`).then(m => m.delete(5000));
  if (reason === "") return msg.channel.sendMessage(`${msg.author}, please include a reason in your report~`).then(m => m.delete(5000));

  let user;
  originGuild.fetchBans().then(bans => {
    user = bans.get(userQuery);
    if (!user) user = originGuild.members.get(userQuery);
    if (!user) user = {username: "?", discriminator: "?", id: userQuery};
    processGunban(bot, msg, originGuild, user, reason).then((unbanUser, count) => {
      msg.channel.sendMessage(`${msg.author}, ${unbanUser.username} (${unbanUser.id}) was unbanned across ${count} servers ^-^`);
    }).catch((unbanUser, count, countNoUnban) => {
      msg.channel.sendMessage(`${msg.author}, ${unbanUser.username} (${unbanUser.id}) was unbanned across ${count - countNoUnban} servers ^-^ (failed on ${countNoUnban} servers)`);
    });
  });
};

function processGunban(bot, msg, originGuild, user, reason) {
  let count = 0;
  let countNoUnban = 0;

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

        guild.unban(user.id).then(unbanUser => {
          if (user.username === "?" && user.discriminator === "?" && typeof unbanUser !== "string") user = unbanUser;

          let logDetails = stripIndents`
          **Action:**          Global Unban
          **Origin:**          ${originGuild.name}
          **User:**             ${user.username}#${user.discriminator} (${user.id})
          **Reason:**        ${reason}
          \u200b
          `;

          let logMsg = {
            color: 327462,
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

          if (count === bot.guilds.size - 1 && countNoUnban === 0) resolve(user, count);
          else if (count === bot.guilds.size - 1 && countNoUnban > 0) reject(user, count, countNoUnban);
        }).catch(() => {
          count++;
          countNoUnban++;

          if (count === bot.guilds.size - 1 && countNoUnban === 0) resolve(user, count);
          else if (count === bot.guilds.size - 1 && countNoUnban > 0) reject(user, count, countNoUnban);
        });
      });
    });
  });
}
