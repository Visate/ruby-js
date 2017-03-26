// Search command
const YouTubeAPI = require("simple-youtube-api");

exports.help = {
  name: "search",
  usage: "[number of results] <search>",
  description: "Searches YouTube for a video.",
  extendedhelp: "Searches YouTube for a video. Defaults to 5 results if a number isn't provided. If the first character of the video is a number, enclose the search in quotation marks. Only searches up to a maximum of 50 videos."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["find"],
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  const YouTube = new YouTubeAPI(client.config.apiKeys.google);

  let index = 0;
  let count = 5;
  let search = suffix;
  if (suffix.startsWith("\"")) search = suffix.slice(1, -1);
  else if (!isNaN(suffix.split(" ")[0])) {
    count = parseInt(suffix.split(" ")[0], 10);
    search = suffix.split(" ").slice(1).join(" ");
  }
  if (count > 50) count = 50;

  YouTube.searchVideos(search, count).then(videos => {
    if (!videos[0]) return msg.channel.sendMessage("No videos were found with this search!");
    let collector = msg.channel.createCollector(m => m.author === msg.author, {time: 10000 * count});
    let currentVideo;
    let lastMsg;
    let visible = false;
    YouTube.getVideoByID(videos[index].id).then(video => {
      currentVideo = video;
      lastMsg = msg.channel.sendEmbed({
        color: 3447003,
        author: {
          name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
          icon_url: msg.author.avatarURL
        },
        description: client.util.commonTags.stripIndents`
        **Result ${index + 1}/${count}:**
        [${video.title}](${video.url})

        Is this the right video? \`y, n, exit\`
        `,
        image: {
          url: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`
        },
        footer: {
          text: "Music Search",
          icon_url: client.user.avatarURL
        }
      }).then(m => {
        lastMsg = m;
        visible = true;
      });
    });
    collector.on("message", m => {
      if (!currentVideo || !lastMsg || !visible) return m.delete();
      if (m.content === "y") {
        m.delete();
        lastMsg.delete();
        collector.stop("queue");
      }

      else if (m.content === "n") {
        m.delete();
        lastMsg.delete();
        lastMsg = null;
        visible = false;
        index++;
        if (index === count) return collector.stop("finished");
        YouTube.getVideoByID(videos[index].id).then(video => {
          currentVideo = video;
          lastMsg = msg.channel.sendEmbed({
            color: 3447003,
            author: {
              name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
              icon_url: msg.author.avatarURL
            },
            description: client.util.commonTags.stripIndents`
            **Result ${index + 1}/${count}:**
            [${video.title}](${video.url})

            Is this the right video? \`y, n, exit\`
            `,
            image: {
              url: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`
            },
            footer: {
              text: "Music Search",
              icon_url: client.user.avatarURL
            }
          }).then(m => {
            lastMsg = m;
            visible = true;
          });
        });
      }

      else if (m.content === "exit") {
        m.delete();
        lastMsg.delete();
        collector.stop("exit");
      }
    });

    collector.on("end", (collection, reason) => {
      if (reason === "finished") msg.channel.sendMessage("Oh well~").then(m => m.delete(5000));
      else if (reason === "time") {
        lastMsg.delete();
        msg.channel.sendMessage("Time's up! Try again later~").then(m => m.delete(5000));
      }
      else if (reason === "queue") {
        client.util.musicHandler.queueSong(msg, currentVideo.title, currentVideo.durationSeconds, `https://img.youtube.com/vi/${currentVideo.id}/mqdefault.jpg`, currentVideo.url, currentVideo.url, "youtube");
      }
    });
  });
};
