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

exports.run = (bot, msg) => {
  let player = bot.musicHandler.getPlayer(msg.guild);
  if (player && bot.musicHandler.checkDJ(bot, msg)) {
    msg.channel.sendMessage("Stopping all music playback!").then(() => {
      bot.musicHandler.stopPlayback(msg.guild);
    });
  }
};
