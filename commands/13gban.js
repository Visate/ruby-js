// Gban command

exports.help = {
  name: "gban",
  usage: "<user> <reason>",
  description: "Globally bans a user across all servers and logs it.",
  extendedhelp: "Globally bans a user across all servers and logs it. They are PM'd with the reason and a link to the appeal form. Include a reason in the command!"
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
  let originChannel = msg.channel;

  let userQuery = suffix.split(" ")[0];
  let reason = suffix.substring(userQuery.length + 1);

  if (userQuery.startsWith("<@!")) userQuery = userQuery.slice(3, -1);
  else if (userQuery.startsWith("<@")) userQuery = userQuery.slice(2, -1);

  if (!suffix) return msg.channel.sendMessage(`${msg.author}, please provide a user ID or mention and a reason~`).then(m => m.delete(5000));
  if (isNaN(userQuery)) return msg.channel.sendMessage(`${msg.author}, please provide a valid user ID or mention~`).then(m => m.delete(5000));
  if (reason === "") return msg.channel.sendMessage(`${msg.author}, please include a reason in your report~`).then(m => m.delete(5000));

  let user;
  let pmStatus = false;

  originGuild.fetchBans().then(bans => {
    user = bans.get(userQuery);
    if (!user) user = originGuild.members.has(userQuery) ? originGuild.members.get(userQuery).user : {username: "?", discriminator: "?", id: userQuery, placeholder: true};
    if (!user.placeholder) pmStatus = messageUser(user, msg, reason);
    processGban(client, msg, originGuild, originChannel, user, reason, pmStatus).then(([ bannedUser, count ]) => {
      msg.channel.sendMessage(`${msg.author}, ${bannedUser.username} (${bannedUser.id}) was banned in ${count} server${count === 1 ? "" : "s"} ^-^`);
    }).catch(([ bannedUser, count, countNoBan ]) => {
      msg.channel.sendMessage(`${msg.author}, ${bannedUser.username} (${bannedUser.id}) was banned in ${count - countNoBan} server${count - countNoBan === 1 ? "" : "s"} ^-^ (failed on ${countNoBan} server${count - countNoBan === 1 ? "" : "s"})`);
    });
  });
};

function messageUser(user, msg, reason) {
  let msgPM = msg.client.util.commonTags.stripIndents`
  Oh no! It appears that you have been global banned by ${msg.author.username}#${msg.author.discriminator}.
  **Reason:** ${reason}

  If you feel that this was unjust, feel free to appeal your ban using the form linked below~ :heart:
  ${msg.client.config.resources.banForm}
  `;

  user.sendMessage(msgPM).then(() => {
    return true;
  }).catch(() => {
    return false;
  });
}

function processGban(client, msg, originGuild, originChannel, origUser, reason, pmStatusInit) {
  return new Promise((resolve, reject) => {

    let count = 0;
    let countNoBan = 0;
    let pmStatus = pmStatusInit;
    let user = origUser;


    function checkPromise() {
      if (count === client.guilds.size && countNoBan === 0) resolve([user, count]);
      else if (count === client.guilds.size && countNoBan > 0) reject([user, count, countNoBan]);
    }

    client.guilds.forEach(guild => {
      count++;

      let rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");

      let caseNum;
      if (rubyLogCh) rubyLogCh.fetchMessages({limit: 1}).then(msgs => {
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

        guild.ban(user.id, 1).then(bannedUser => {
          if (user.placeholder && typeof bannedUser !== "string") {
            user = bannedUser.user ? bannedUser.user : bannedUser;
            if (!pmStatus) pmStatus = messageUser(user, msg, reason);
          }

          let logDetails = client.util.commonTags.stripIndents`
          **Action:**          Global Ban
          **Origin:**          ${originGuild.name}
          **Channel:**       ${originChannel.name}
          **User:**             ${user} || ${user.username}#${user.discriminator} (${user.id})
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
              icon_url: client.user.avatarURL,
              text: `Case ${caseNum}`
            }
          };

          rubyLogCh.sendEmbed(logMsg);
          checkPromise();
        }).catch(err => {
          client.warn(`Unable to ban in ${guild.name}: ${err}`);
          countNoBan++;
          checkPromise();
        });
      });
      else {
        client.warn(`No ruby-log channel found in ${guild.name}!`);
        guild.ban(user.id, 1).then(bannedUser => {
          if (user.placeholder && typeof bannedUser !== "string") {
            user = bannedUser.user ? bannedUser.user : bannedUser;
            if (!pmStatus) pmStatus = messageUser(user, msg, reason);
          }
          checkPromise();
        }).catch(err => {
          client.warn(`Unable to ban in ${guild.name}: ${err}`);
          countNoBan++;
          checkPromise();
        });
      }
    });
  });
}
