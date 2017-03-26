// stream command

exports.help = {
  name: "stream",
  usage: "[source]",
  description: "Starts up a music stream.",
  extendedhelp: `Starts up a music stream. The stream source can be defined, #prefixmusic stream list to see available streams. If there is currently music playback, it must be stopped before a stream can be started.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  let stream;
  let player = client.util.musicHandler.getPlayer(msg.guild);
  if (player.isPlaying()) return msg.channel.sendMessage("Stop music playback first before you request a stream!");

  if (suffix.toLowerCase() === "random" || !suffix) stream = client.util.streamManager.randomStream();
  else if (client.util.streamManager.hasStream(suffix)) stream = client.util.streamManager.getStream(suffix);
  else if (suffix.toLowerCase() === "list") return msg.channel.sendMessage(`**Available Streams:**\n${client.util.streamManager.getStreams().map(stream => stream.name).join(", ")}`);
  else return msg.channel.sendMessage(`Invalid stream name, use \`${client.config.prefix}music stream list\` to view available streams!~`);

  if (stream) client.util.musicHandler.startStreaming(msg, stream);
};
