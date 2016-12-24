exports.help = {
  name: "skip",
  description: "Skips currently playing song.",
  extendedhelp: "Skips currently playing song. Cannot be used in stream mode."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (bot, msg) => {
  bot.musicHandler.skipSong(bot, msg);
};
