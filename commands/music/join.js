exports.help = {
  name: "join",
  description: `Joins a voice channel.`,
  extendedhelp: `Joins the user's current voice channel. Will not work if user is not in a voice channel.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["j", "summon"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  // placeholder
};
