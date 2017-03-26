// Playlist command
const YouTubeAPI = require("simple-youtube-api");

exports.help = {
  name: "playlist",
  usage: "[number of videos] <playlist>",
  description: "Queues a YouTube playlist.",
  extendedhelp: "Queues a YouTube playlist. If no number is specified, the first 50 videos will be added to the queue. Can only grab a maximum of 50."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  const YouTube = new YouTubeAPI(client.config.apiKeys.google);

  let count = 50;
  let playlistQuery = suffix;
  if (!isNaN(suffix.split(" ")[0])) {
    count = parseInt(suffix.split(" ")[0], 10);
    playlistQuery = suffix.split(" ").slice(1).join(" ");
  }

  if (count > 50) count = 50;
  if (!playlistQuery) return msg.channel.sendMessage("Please provide a link to a playlist!");

  YouTube.getPlaylist(playlistQuery).then(playlist => {
    playlist.getVideos(count).then(videos => {
      client.util.musicHandler.queuePlaylist(msg, YouTube, videos).then(videoCount => {
        let embed = {
          color: 3447003,
          author: {
            name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
            icon_url: msg.author.avatarURL
          },
          description: client.util.commonTags.stripIndents`
          :thumbsup: Added **${videoCount} ${videoCount !== 1 ? "videos" : "video"}** from playlist [${playlist.title}](${playlist.url}) to the queue!`,
          footer: {
            text: "Music Playlist",
            icon_url: client.user.avatarURL
          }
        };
        msg.channel.sendEmbed(embed);
      });
    }).catch(err => msg.channel.sendMessage(`Error occurred on adding playlist: ${err}`));
  }).catch(err => msg.channel.sendMessage(`Error occurred on adding playlist: ${err}`));
};
