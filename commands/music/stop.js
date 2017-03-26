exports.help = {
  name: "stop",
  description: "Stops all music playback.",
  extendedhelp: "Stops all music playback."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (client, msg) => {
  let player = client.util.musicHandler.getPlayer(msg.guild);
  if (player) {
    msg.channel.sendMessage("Stopping all music playback!").then(() => {
      player.stopPlayback();
    });
  }
};
