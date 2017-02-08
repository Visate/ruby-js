// Warn command
const stripIndents = require("common-tags").stripIndents;

exports.help = {
  name: "warn",
  usage: "<mention> <reason>",
  description: "Warns a user and posts it in the log channel.",
  extendedhelp: "Warns a user and posts it in the log channel. Use this in the channel it occured in with a user mention and a reason."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  alternateInvoke: true,
  aliases: [],
  permLevel: 1
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
  else if (!userid) return msg.channel.sendMessage(`${msg.author}, please mention the user you are warning~`).then(m => m.delete(5000));
  else if (reason === "") return msg.channel.sendMessage(`${msg.author}, please include a reason in your report~`).then(m => m.delete(5000));

  let member = guild.members.get(userid);
  if (!member) return msg.channel.sendMessage(`${msg.author}, I cannot find that user!`).then(m => m.delete(5000));

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

    let logDetails = stripIndents`
    **Action:**          Warn
    **Channel:**       ${msg.channel.name}
    **User:**             ${member.user.username}#${member.user.discriminator} (${member.id})
    **Reason:**        ${reason}
    \u200b
    `;

    let logMsg = {
      color: 16767078,
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

    rubyLogCh.sendEmbed(logMsg).then(() => {
      msg.channel.sendMessage("^-^").then(m => m.delete(5000));
    });
  });
};
