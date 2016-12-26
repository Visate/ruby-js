// Playlist command
const config = require("../../config.json");
const YouTubeAPI = require("simple-youtube-api");
const YouTube = new YouTubeAPI(config.apiKeys.googleAPIKey);
const stripIndents = require("common-tags").stripIndents;

exports.help = {
  name: "playlist",
  usage: "[number of videos] <playlist>",
  description: "Queues a YouTube playlist.",
  extendedhelp: "Queues a YouTube playlist. If no number is specified, the first 50 videos will be added to the queue."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let count = 50;
  let playlistQuery = suffix;
  if (!isNaN(suffix.split(" ")[0])) {
    count = parseInt(suffix.split(" ")[0], 10);
    playlistQuery = suffix.split(" ").slice(1).join(" ");
  }

  if (!playlistQuery) return msg.channel.sendMessage("Please provide a link to a playlist!");

  YouTube.getPlaylist(playlistQuery).then(playlist => {
    playlist.getVideos(count).then(videos => {
      bot.musicHandler.addPlaylistToQueue(bot, msg, YouTube, videos).then(videoCount => {
        let embed = {
          color: 3447003,
          author: {
            name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
            icon_url: msg.author.avatarURL
          },
          description: stripIndents`
          :thumbsup: Added **${videoCount} ${videoCount !== 1 ? "videos" : "video"}** from playlist [${playlist.title}](${playlist.url}) to the queue!`,
          footer: {
            text: "Music Playlist",
            icon_url: bot.user.avatarURL
          }
        };
        msg.channel.sendEmbed(embed);
      });
    }).catch(err => msg.channel.sendMessage(`Error occurred on adding playlist while fetching videos: ${err}`));
  }).catch(err => msg.channel.sendMessage(`Error occurred on adding playlist while fetching playlist: ${err}`));
};
