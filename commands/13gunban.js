// Gban command

exports.help = {
  name: "gunban",
  usage: "<user> <reason>",
  description: "Globally unbans a user across all servers and logs it.",
  extendedhelp: "Globally unbans a user across all servers and logs it. Include a reason in the command!"
};

exports.config = {
  enabled: true,
  guildOnly: true,
  alternateInvoke: true,
  aliases: [],
  permLevel: 6
};

exports.run = (client, msg, suffix) => {
  let originGuild = msg.guild;

  let userQuery = suffix.split(" ")[0];
  let reason = suffix.substring(userQuery.length + 1);

  if (userQuery.startsWith("<@!")) userQuery = userQuery.slice(3, -1);
  else if (userQuery.startsWith("<@")) userQuery = userQuery.slice(2, -1);

  if (!suffix) return msg.channel.sendMessage(`${msg.author}, please provide a user ID or mention and a reason~`).then(m => m.delete(5000));
  if (isNaN(userQuery)) return msg.channel.sendMessage(`${msg.author}, please provide a valid user ID or mention~`).then(m => m.delete(5000));
  if (reason === "") return msg.channel.sendMessage(`${msg.author}, please include a reason in your report~`).then(m => m.delete(5000));

  let user;
  originGuild.fetchBans().then(bans => {
    user = bans.get(userQuery);
    if (!user) user = originGuild.members.has(userQuery) ? originGuild.members.get(userQuery).user : {username: "?", discriminator: "?", id: userQuery, placeholder: true};
    processGunban(client, msg, originGuild, user, reason).then(([ unbanUser, count ]) => {
      msg.channel.sendMessage(`${msg.author}, ${unbanUser.username} (${unbanUser.id}) was unbanned in ${count} server${count === 1 ? "" : "s"} ^-^`);
    }).catch(([ unbanUser, count, countNoUnban ]) => {
      msg.channel.sendMessage(`${msg.author}, ${unbanUser.username} (${unbanUser.id}) was unbanned in ${count - countNoUnban} server${count - countNoUnban === 1 ? "" : "s"} ^-^ (failed on ${countNoUnban} server${count - countNoUnban === 1 ? "" : "s"})`);
    });
  });
};

function processGunban(client, msg, originGuild, user, reason) {
  let count = 0;
  let countNoUnban = 0;

  return new Promise((resolve, reject) => {

    function checkPromise() {
      if (count === client.guilds.size - 1 && countNoUnban === 0) resolve([user, count]);
      else if (count === client.guilds.size - 1 && countNoUnban > 0) reject([user, count, countNoUnban]);
    }

    client.guilds.forEach(guild => {
      if (guild.id === "235144885101920256") return; // exempt testing server
      count++;

      let rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");

      let caseNum;
      rubyLogCh.fetchMessages({limit: 1}).then(msgs => {
        let pastCase = msgs.first();
        if (!pastCase) caseNum = 1;
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
          if (user.placeholder && typeof unbanUser !== "string") user = unbanUser;

          let logDetails = client.util.commonTags.stripIndents`
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
              icon_url: client.user.avatarURL,
              text: `Case ${caseNum}`
            }
          };

          rubyLogCh.sendEmbed(logMsg);
          checkPromise();
        }).catch(() => {
          countNoUnban++;
          checkPromise();
        });
      });
    });
  });
}
