exports.help = {
  name: "forceskip",
  description: "Force skip the currently playing song.",
  extendedhelp: "Force skips currently playing song. Cannot be used in stream mode."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.run = (client, msg) => {
  client.util.musicHandler.forceSkip(msg);
};
