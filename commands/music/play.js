exports.help = {
  name: "play",
  usage: "<URL|search>",
  description: `Adds a song to the queue. Can be YouTube/SoundCloud URL or search.`,
  extendedhelp: `Adds a song to the music queue, and if nothing is already playing, starts playback. You may send either a YouTube/SoundCloud URL or a search query which will search on YouTube.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["p"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  // placeholder
};
