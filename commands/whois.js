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

};
