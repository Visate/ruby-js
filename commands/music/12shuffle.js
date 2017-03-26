// Shuffle command

exports.help = {
  name: "shuffle",
  description: "If there is a music queue, shuffles the queue.",
  extendedhelp: "If there is a music queue, shuffles the queue while leaving the currently playing song in the front."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (client, msg) => {
  client.util.musicHandler.shuffleQueue(msg);
};
