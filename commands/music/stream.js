const config = require("../../config.json");
const streams = require("../../lists/streams.js");

exports.help = {
  name: "stream",
  usage: "[source]",
  description: `Starts up a music stream.`,
  extendedhelp: `Starts up a music stream. The stream source can be defined, ${config.settings.prefix}music stream list to see available streams. If there is currently music playback, it must be stopped before a stream can be started.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  // placeholder
};
