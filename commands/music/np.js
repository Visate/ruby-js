exports.help = {
  name: "np",
  description: `Displays the currently playing song.`,
  extendedhelp: `Displays the currently playing song.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["nowplaying", "now"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  // placeholder
};
