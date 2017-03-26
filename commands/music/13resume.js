exports.help = {
  name: "resume",
  description: "Resumes music playback.",
  extendedhelp: "Resumes music playback. Cannot be used in stream mode."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (client, msg) => {
  let player = client.util.musicHandler.getPlayer(msg.guild);
  if (player) player.resumePlayback(msg);
};
