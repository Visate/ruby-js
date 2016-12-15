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
  aliases: [],
  permLevel: 6
};

exports.run = (bot, msg, suffix) => {
  let originGuild = msg.guild;
  let originChannel = msg.channel;

  
};
