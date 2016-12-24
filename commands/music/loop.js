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

exports.run = (bot, msg) => {
  let player = bot.musicHandler.getPlayer(msg.guild);
  if (!bot.musicHandler.checkDJ(bot, msg)) return;

  if (player) {
    let state = bot.musicHandler.toggleLooping(msg.guild);
    if (state) return msg.channel.sendMessage("Now looping the queue!");
    else if (!state) return msg.channel.sendMessage("Looping disabled!");
  }
};
