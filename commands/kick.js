// Kick command
const stripIndents = require("common-tags").stripIndents;

exports.help = {
  name: "kick",
  usage: "<user> <reason>",
  description: "Kicks the user and posts it in the log channel.",
  extendedhelp: "Kicks the user and posts it in the log channel. They are PM'd with the reason and an invite link. This should be used in the channel where the offense occurred with a mention and a reason."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  alternateInvoke: true,
  aliases: [],
  permLevel: 3
};

exports.run = (bot, msg, suffix) => {

  let guild = msg.guild;

  let userQuery = suffix.split(" ")[0];
  let reason = suffix.substring(userQuery.length + 1);
  let userid;

  if (userQuery.startsWith("<@!")) userid = userQuery.slice(3, -1);
  else if (userQuery.startsWith("<@")) userid = userQuery.slice(2, -1);

  let rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");

  if (!suffix) return msg.channel.sendMessage(`${msg.author}, please provide a user mention and a reason~`).then(m => m.delete(5000));
  else if (!userid) return msg.channel.sendMessage(`${msg.author}, please mention the user you are kicking~`).then(m => m.delete(5000));
  else if (reason === "") return msg.channel.sendMessage(`${msg.author}, please include a reason in your report~`).then(m => m.delete(5000));

  let member = guild.members.get(userid);

  if (!member) return msg.channel.sendMessage(`${msg.author}, I cannot find that user!`).then(m => m.delete(5000));
  if (!member.bannable) return msg.channel.sendMessage(`${msg.author}, I cannot kick that user!`).then(m => m.delete(5000));

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

    let logDetails = stripIndents`
    **Action:**          Kick
    **Channel:**       ${msg.channel.name}
    **User:**             ${member.user.username}#${member.user.discriminator} (${member.id})
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

    let msgPM = stripIndents`
    Oh no! It appears that you have been kicked by ${msg.author.username}#${msg.author.discriminator}.
    **Reason:** ${reason}

    If you feel that this was unjust, feel free to talk to NyaaKoneko#1495 about it. You are welcome to join back with this link, please behave this time~ :heart:
    `;
    guild.fetchInvites().then(function(invites) {
      let invite = invites.find(invite => invite.maxAge === 0 && invite.temporary === false && invite.channel.id === guild.defaultChannel.id);
      if (!invite) {
        guild.defaultChannel.createInvite({maxAge: 0}).then(inviteLobby => {
          let url = inviteLobby.url;
          msgPM += `\n${url}`;
          processKick(msg, rubyLogCh, logMsg, member, msgPM);
        });
      }
      else {
        msgPM += `\n${invite.url}`;
        processKick(msg, rubyLogCh, logMsg, member, msgPM);
      }
    });
  });
};

function processKick(msg, logCh, logMsg, member, msgPM) {
  member.sendMessage(msgPM).then(() => {
    member.kick().then(() => {
      logCh.sendEmbed(logMsg).then(() => {
        msg.channel.sendMessage("^-^").then(m => m.delete(5000));
      });
    });
  });
}
