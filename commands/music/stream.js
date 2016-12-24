// stream command
const config = require("../../config.json");
const streams = require("../../lists/streams.js");

exports.help = {
  name: "stream",
  usage: "[source]",
  description: "Starts up a music stream.",
  extendedhelp: `Starts up a music stream. The stream source can be defined, ${config.settings.prefix}music stream list to see available streams. If there is currently music playback, it must be stopped before a stream can be started.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let stream;
  if (bot.musicHandler.isPlaying(msg.guild)) return msg.channel.sendMessage("Stop music playback first before you request a stream!");
  if (!bot.musicHandler.checkDJ(bot, msg)) return;

  if (suffix.toLowerCase() === "random" || !suffix) stream = streams.randomStream();
  else if (streams.hasStream(suffix)) stream = streams.getStream(suffix);
  else if (suffix.toLowerCase() === "list") return msg.channel.sendMessage(`**Available Streams:\n${streams.getStreams().map(stream => stream.getName()).join(", ")}`);
  else return msg.channel.sendMessage(`Invalid stream name, use \`${config.settings.prefix}music stream list\` to view available streams!~`);

  if (stream) bot.musicHandler.startStreaming(msg, stream);
};
