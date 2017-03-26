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

exports.run = (client, msg) => {
  if (!msg.member.voiceChannel) return msg.channel.sendMessage("Please join a voice channel first then use the command! :heart:");
  if (client.util.musicHandler.getPlayer(msg.guild)) return msg.channel.sendMessage("There is already an active music player in this guild!");

  msg.member.voiceChannel.join()
  .then(connection => {
    client.util.musicHandler.createPlayer(msg);

    connection.on("disconnect", () => {
      let player = client.util.musicHandler.getPlayer(msg.guild);
      player.notify("Disconnected from voice!");
      client.util.musicHandler.deletePlayer(msg.guild);
    });
  })
  .catch(e => msg.channel.sendMessage(`Error on joining channel: ${e}`));
};
