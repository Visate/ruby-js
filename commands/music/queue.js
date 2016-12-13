exports.help = {
  name: "queue",
  usage: "[page number]",
  description: `Displays the upcoming songs.`,
  extendedhelp: `Displays the upcoming songs. Can be used with a number (if necessary) to display more entries by changing pages.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["q"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  // placeholder
};
