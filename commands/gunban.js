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
  aliases: [],
  permLevel: 6
};

exports.run = (bot, msg, suffix) => {
  let originGuild = msg.guild;
  let originChannel = msg.channel;


};
