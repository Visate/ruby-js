exports.help = {
  name: "join",
  description: "Joins a voice channel.",
  extendedhelp: "Joins the user's current voice channel. Will not work if user is not in a voice channel."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["summon"],
  permLevel: 0
};

exports.run = (bot, msg) => {
  if (!msg.member.voiceChannel) return msg.channel.sendMessage("Please join a voice channel first then use the command! :heart:");
  if (bot.musicHandler.getPlayer(msg.guild)) return msg.channel.sendMessage("There is already an active music player in this guild!");

  msg.member.voiceChannel.join().then(connection => {
    let djMode = false;
    msg.member.voiceChannel.members.forEach(m => {
      if (m.id === bot.user.id) return;
      if (bot.checkPerms({guild: m.guild, member: m, author: m.user}) > 1) djMode = true;
    });

    bot.musicHandler.createPlayer(msg, djMode);

    connection.on("disconnect", () => {
      let player = bot.musicHandler.getPlayer(msg.guild);
      player.tChannel.sendMessage("Disconnected from voice!");
      bot.musicHandler.deletePlayer(msg.guild);
    });
  }).catch(e => msg.channel.sendMessage(`Error on joining channel: ${e}`));
};
