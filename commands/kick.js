// Kick command

exports.help = {
  name: "kick",
  usage: "<user> <reason>",
  description: "Kicks the user and posts it in the log channel.",
  extendedhelp: "Kicks the user and posts it in the log channel. They are PM'd with the reason and an invite link. This should be used in the channel where the offense occurred with a mention and a reason."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["k"],
  permLevel: 3
};

exports.run = (bot, msg, suffix) => {
  let guild = msg.guild;

  let userQuery = suffix.split(" ")[0];
  let reason = suffix.substring(userQuery.length + 1);
  let userid;

  if (userQuery.startsWith("<@!")) userid = userQuery.substring(3, userQuery.length - 1);
  else if (userQuery.startsWith("<@")) userid = userQuery.substring(2, userQuery.length - 1);

  let rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");

  if (!suffix) return msg.channel.sendMessage(`${message.author}, please provide a user mention and a reason~`).then(m => m.delete(5000));
  else if (!userid) return msg.channel.sendMessage(`${message.author}, please mention the user you are kicking~`).then(m => m.delete(5000));
  else if (reason === "") return msg.channel.sendMessage(`${message.author}, please include a reason in your report~`).then(m => m.delete(5000));

  let member = guild.members.find(member => member.id === userid);

  let caseNum;
  rubyLogCh.fetchMessages({limit: 1}).then(msgs => {
    let pastCase = msgs.array()[0];
    if (msgs.size === 0) caseNum = 1;
    else if (pastCase.embeds.length === 0) {
      let caseTxt = pastCase.content.split("\n")[0];
      caseNum = parseInt(caseTxt.substring(21, caseTxt.indexOf(" |")), 10) + 1;
    }
    else if (pastCase.embeds.length > 0) {
      let caseTxt = msg.embeds[0].footer.text;
      caseNum = parseInt(caseTxt.substring(5), 10) + 1;
    }
    if (isNaN(caseNum)) caseNum = 1;

    let msgArray = [];
    msgArray.push(`**Action:**          Kick`);
    msgArray.push(`**Channel:**       ${msg.channel.name}`);
    msgArray.push(`**User:**             ${member.user.username}#${member.user.discriminator} (${member.id})`);
    msgArray.push(`**Reason:**        ${reason}`);

    let logMsg = {
      color: 16723762,
      author: {
        name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
        icon_url: msg.author.avatarURL
      },
      description: msgArray.join("\n"),
      footer: {
        icon_url: bot.user.avatarURL,
        text: `Case ${caseNum}`
      }
    };

    let msgPM = [];
    msgPM.push("Oh no! It appears that you have been kicked by " + message.author.username + ".");
    msgPM.push("**Reason:** " + reason);
    msgPM.push("\nIf you feel that this was unjust, feel free to talk to NyaaKoneko#1495 about it. You are welcome to join back with this link, please behave this time~ :heart:");
    guild.fetchInvites().then(function(invites) {
      let invite = invites.find(invite => invite.maxAge === 0 && invite.temporary === false && invite.channel.name === "casual-lobby");
      if (invite === null | invite === undefined) {
        let lobby = guild.channels.find(channel => channel.name === "casual-lobby");
        lobby.createInvite({maxAge: 0}).then((inviteLobby) => {
          let url = inviteLobby.url;
          msgPM.push(url);
        });
      }
      else {
        msgPM.push(invite.url);
      }

      member.sendMessage(msgPM).then(() => {
        member.kick().then(() => {
          rubyLogCh.sendMessage("", {embed: logMsg}).then(() => msg.channel.sendMessage("^-^").then(m => m.delete(5000)));
        });
      });
  });
};
