exports.help = {
  name: "loop",
  description: "Toggles music looping state.",
  extendedhelp: "Toggles the music looping state. All completed songs will be moved to the end of the queue instead of deleted in this mode."
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
    let state = player.toggleLooping();
    if (state) return msg.channel.sendMessage("Now looping the queue!");
    else if (!state) return msg.channel.sendMessage("Looping disabled!");
  }
};
