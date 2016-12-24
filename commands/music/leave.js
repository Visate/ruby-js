exports.help = {
  name: "leave",
  description: "Disconnects the bot from the voice channel.",
  extendedhelp: "Disconnects the bot from the voice channel. All info is cleared in the process."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["disconnect"],
  permLevel: 0
};

exports.run = (bot, msg) => {
  let player = bot.musicHandler.getPlayer(bot, msg.guild);
  if (msg.member.voiceChannel.id !== player.vChannel.id) return msg.channel.sendMessage("You aren't connected to the active voice channel!");
  if (player && bot.musicHandler.checkDJ(bot, msg)) {
    player.vChannel.connection.disconnect();
  }
};
