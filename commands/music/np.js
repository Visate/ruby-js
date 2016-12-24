exports.help = {
  name: "np",
  description: "Displays the currently playing song.",
  extendedhelp: "Displays the currently playing song."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["nowplaying", "now", "playing"],
  permLevel: 0
};

exports.run = (bot, msg) => {
  let player = bot.musicHandler.getPlayer(msg.guild);
  let np = bot.musicHandler.getNowPlaying(msg.guild);

  if (!np) return msg.channel.sendMessage("Nothing is playing right now!");
  else msg.channel.sendMessage(`Now playing in ${player.vChannel.name}: ${np}`);
};
