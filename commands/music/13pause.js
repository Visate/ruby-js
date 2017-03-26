exports.help = {
  name: "pause",
  description: "Pauses music playback.",
  extendedhelp: "Pauses music playback. Cannot be used in stream mode."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (client, msg) => {
  let player = client.util.musicHandler.getPlayer(msg.guild);
  if (player) player.pausePlayback(msg);
};
