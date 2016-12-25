// Search command
const config = require("../../config.json");
const YouTubeAPI = require("simple-youtube-api");
const YouTube = new YouTubeAPI(config.apiKeys.googleAPIKey);
const stripIndents = require("common-tags").stripIndents;

exports.help = {
  name: "search",
  usage: "[number of results] <search>",
  description: "Searches YouTube for a video.",
  extendedhelp: "Searches YouTube for a video. Defaults to 5 results if a number isn't provided. If the first character of the video is a number, enclose the search in quotation marks."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["find"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let index = 0;
  let count = 5;
  let search = suffix;
  if (suffix.startsWith("\"")) search = suffix.slice(1, -1);
  else if (!isNaN(suffix.split(" ")[0])) {
    count = parseInt(suffix.split(" ")[0], 10);
    search = suffix.split(" ").slice(1).join(" ");
  }

  YouTube.searchVideos(search, count).then(videos => {
    let collector = msg.channel.createCollector(m => m.author === msg.author, {time: 60000});
    let currentVideo;
    let lastMsg;
    YouTube.getVideoByID(videos[index].id).then(video => {
      currentVideo = video;
      lastMsg = msg.channel.sendEmbed({
        color: 3447003,
        author: {
          name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
          icon_url: msg.author.avatarURL
        },
        description: stripIndents`
        **Result ${index + 1}/${count}:**
        [${video.title}](${video.url})

        Is this the right video? \`y, n, exit\`
        `,
        image: {
          url: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`
        },
        footer: {
          text: "Music Search",
          icon_url: bot.user.avatarURL
        }
      }).then(m => lastMsg = m);
    });
    collector.on("message", m => {
      if (!currentVideo) return;
      if (m.content === "y") {
        m.delete();
        lastMsg.delete();
        collector.stop("queue");
      }

      else if (m.content === "n") {
        m.delete();
        lastMsg.delete();
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
            description: stripIndents`
            **Result ${index + 1}/${count}:**
            [${video.title}](${video.url})

            Is this the right video? \`y, n, exit\`
            `,
            image: {
              url: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`
            },
            footer: {
              text: "Music Search",
              icon_url: bot.user.avatarURL
            }
          }).then(m => lastMsg = m);
        });
      }
      else if (m.content === "exit") {
        m.delete();
        lastMsg.delete();
        collector.stop("exit");
      }
    });

    collector.on("end", (collection, reason) => {
      if (reason === "finished") msg.channel.sendMessage("Oh well~");
      else if (reason === "time") {
        lastMsg.delete();
        msg.channel.sendMessage("Time's up! Try again later~");
      }
      else if (reason === "queue") {
        let min = ~~(currentVideo.durationSeconds / 60);
        let sec = currentVideo.durationSeconds % 60;
        if (sec < 10) sec = `0${sec}`;
        bot.musicHandler.addToQueue(bot, msg, currentVideo.title, `${min}:${sec}`, `https://img.youtube.com/vi/${currentVideo.id}/mqdefault.jpg`, currentVideo.url, currentVideo.url, "youtube");
      }
    });
  });
};
