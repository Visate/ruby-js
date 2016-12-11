// Disables listener limit
require('events').EventEmitter.prototype._maxListeners = 0;
// Discord variables
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true, fetchAllMembers: true});

// Grabs values from the config file and assigns them to vars
var ConfigFile = require('./config.json');
var token = ConfigFile.discord_token;
var prefix = ConfigFile.prefix;
var soundcloudId = ConfigFile.soundcloud_id;
var nani = require('nani').init(ConfigFile.anilist_id, ConfigFile.anilist_secret);
var mathjs = require('mathjs');
var Entities = require('html-entities').AllHtmlEntities;
var toTitleCase = require('to-title-case');
var fs = require('fs');
var ytdl = require('ytdl-core');
var entities = new Entities();

// because I'm lazy
var coreCraftId = "95907910558683136";

// List to keep track of music in servers, keyed by guild id
var musicConnections = {};
// All country servers and their invite links (~Nyaa utility)
var countryServers = {
  // Australia servers

  "adelaide": {
    name: "Adelaide",
    invite: "https://discord.gg/0ZDr5SYHMyBDKbpe",
    cooldown: 0
  },

  "brisbane": {
    name: "Brisbane",
    invite: "https://discord.gg/0ZD8LAL4hJvEYViS",
    cooldown: 0
  },

  "cairns": {
    name: "Cairns",
    invite: "https://discord.gg/0eDrq3uuUSAeTK7s",
    cooldown: 0
  },

  "canberra": {
    name: "Canberra",
    invite: "https://discord.gg/0ZfrQK7nk59RKjY9",
    cooldown: 0
  },

  "darwin": {
    name: "Darwin",
    invite: "https://discord.gg/0j4lOe5NEJhmzZu8",
    cooldown: 0
  },

  "melbourne": {
    name: "Melbourne",
    invite: "https://discord.gg/0ZD8H5WEzzfXs2tE",
    cooldown: 0
  },

  "newcastle": {
    name: "Newcastle",
    invite: "https://discord.gg/0Zfqks79aldG43qh",
    cooldown: 0
  },

  "perth": {
    name: "Perth",
    invite: "https://discord.gg/0ZRklMgwOCCXdxl8",
    cooldown: 0
  },

  "port macquarie": {
    name: "Port Macquarie",
    invite: "https://discord.gg/0ZfqZJQHg86OFBNJ",
    cooldown: 0
  },

  "sydney": {
    name: "Sydney",
    invite: "https://discord.gg/0ZBv6u3Iu4sR8Flo",
    cooldown: 0
  },

  "tasmania": {
    name: "Tasmania",
    invite: "https://discord.gg/0ZU0Isybnb5N0sdU",
    cooldown: 0
  },

  "townsville": {
    name: "Townsville",
    invite: "https://discord.gg/0exIe1ZoiENWAcRe",
    cooldown: 0
  },

  // Country servers

  "argentina": {
    name: "Argentina",
    invite: "https://discord.gg/0ZfreIeaue4ZWllZ",
    cooldown: 0
  },

  "austria": {
    name: "Austria",
    invite: "https://discord.gg/0eDTvUmdTTnO34nD",
    cooldown: 0
  },

  "azerbaijan": {
    name: "Azerbaijan",
    invite: "https://discord.gg/0eDU8koqZBua6zRi",
    cooldown: 0
  },

  "belarus": {
    name: "Belarus",
    invite: "https://discord.gg/0eDkryprgZRSodAN",
    cooldown: 0
  },

  "belgium": {
    name: "Belgium",
    invite: "https://discord.gg/0eDl7zo54KXDezAw",
    cooldown: 0
  },

  "bolivia": {
    name: "Bolivia",
    invite: "https://discord.gg/0rAx4zNHesc6cG3i",
    cooldown: 0
  },

  "brazil": {
    name: "Brazil",
    invite: "https://discord.gg/0eDQ03VPUfJgh34L",
    cooldown: 0
  },

  "brunei": {
    name: "Brunei",
    invite: "https://discord.gg/0eDqt0PylwnNXvc6",
    cooldown: 0
  },

  "bulgaria": {
    name: "Bulgaria",
    invite: "https://discord.gg/0eDqbBgXMJtpzNqk",
    cooldown: 0
  },

  "cambodia": {
    name: "Cambodia",
    invite: "https://discord.gg/GVDgJhC",
    cooldown: 0
  },

  "canada": {
    name: "Canada",
    invite: "https://discord.gg/0ZH4lwpdXig65iRs",
    cooldown: 0
  },

  "chile": {
    name: "Chile",
    invite: "https://discord.gg/0is99YaNk3iCFaOg",
    cooldown: 0
  },

  "china": {
    name: "China",
    invite: "https://discord.gg/0eDQD5NHxQfpV1ry",
    cooldown: 0
  },

  "colombia": {
    name: "Colombia",
    invite: "https://discord.gg/0isAFUvc69ZDi5zv",
    cooldown: 0
  },

  "croatia": {
    name: "Croatia",
    invite: "https://discord.gg/0eDqMTWZZxGFsQkm",
    cooldown: 0
  },

  "cuba": {
    name: "Cuba",
    invite: "https://discord.gg/jECXWqf",
    cooldown: 0
  },

  "czech republic": {
    name: "Czech Republic",
    invite: "https://discord.gg/0eDr4N0H87qO52wO",
    cooldown: 0
  },

  "denmark": {
    name: "Denmark",
    invite: "https://discord.gg/0eDQQxxTUZV2WRfA",
    cooldown: 0
  },

  "egypt": {
    name: "Egypt",
    invite: "https://discord.gg/0eDrJgBoZcnhpuBO",
    cooldown: 0
  },

  "estonia": {
    name: "Estonia",
    invite: "https://discord.gg/0isANMe727dt6Slb",
    cooldown: 0
  },

  "finland": {
    name: "Finland",
    invite: "https://discord.gg/0eDrUcKfwx2b2mtR",
    cooldown: 0
  },

  "france": {
    name: "France",
    invite: "https://discord.gg/0ZfrmrAbjCCMK0qU",
    cooldown: 0
  },

  "germany": {
    name: "Germany",
    invite: "https://discord.gg/0ZftW6tl70oFnyfN",
    cooldown: 0
  },

  "greece": {
    name: "Greece",
    invite: "https://discord.gg/0eDQvBoidXPxVYV0",
    cooldown: 0
  },

  "guam": {
    name: "Guam",
    invite: "https://discord.gg/0eDrgRlX8JMsSMJe",
    cooldown: 0
  },

  "hong kong": {
    name: "Hong Kong",
    invite: "https://discord.gg/0eDQjbu1y5hqL9MP",
    cooldown: 0
  },

  "hungary": {
    name: "Hungary",
    invite: "https://discord.gg/0eDs2YLWyKrWsoiI",
    cooldown: 0
  },

  "india": {
    name: "India",
    invite: "https://discord.gg/0eDRr62KdHi5Ucjb",
    cooldown: 0
  },

  "indonesia": {
    name: "Indonesia",
    invite: "https://discord.gg/0eDRVSi64xalGkJk",
    cooldown: 0
  },

  "ireland": {
    name: "Ireland",
    invite: "https://discord.gg/0is83mA2NRSjC4Ct",
    cooldown: 0
  },

  "israel": {
    name: "Israel",
    invite: "https://discord.gg/0bLHcYbMGWFoTmD8",
    cooldown: 0
  },

  "italy": {
    name: "Italy",
    invite: "https://discord.gg/0eDRHRnaAC9AXWkd",
    cooldown: 0
  },

  "japan": {
    name: "Japan",
    invite: "https://discord.gg/0dHiutjeu3hAK9Lu",
    cooldown: 0
  },

  "kazakhstan": {
    name: "Kazakhstan",
    invite: "https://discord.gg/0eDsEUcr2CiwWtU9",
    cooldown: 0
  },

  "lithuania": {
    name: "Lithuania",
    invite: "https://discord.gg/0isA3w9Pg1PCBJzu",
    cooldown: 0
  },

  "malaysia": {
    name: "Malaysia",
    invite: "https://discord.gg/0eDRiiX06ruklt61",
    cooldown: 0
  },

  "mexico": {
    name: "Mexico",
    invite: "https://discord.gg/0rAvVeMaiL45bNax",
    cooldown: 0
  },

  "netherlands": {
    name: "Netherlands",
    invite: "https://discord.gg/0ZDe2a2hrXXNiRuY",
    cooldown: 0
  },

  "new zealand": {
    name: "New Zealand",
    invite: "https://discord.gg/0dIAGN8v3Qjm6VKB",
    cooldown: 0
  },

  "norway": {
    name: "Norway",
    invite: "https://discord.gg/0is8REcaCGQlMMnv",
    cooldown: 0
  },

  "paraguay": {
    name: "Paraguay",
    invite: "https://discord.gg/0rAwcX1PfGFk9zwh",
    cooldown: 0
  },

  "philippines": {
    name: "Philippines",
    invite: "https://discord.gg/0is9YPbrO5jEZWl6",
    cooldown: 0
  },

  "poland": {
    name: "Poland",
    invite: "https://discord.gg/0aEnYYM2Eiv1vWIj",
    cooldown: 0
  },

  "portugal": {
    name: "Portugal",
    invite: "https://discord.gg/0is9szbE6cDkq8Yn",
    cooldown: 0
  },

  "puerto rico": {
    name: "Puerto Rico",
    invite: "https://discord.gg/0rNoDqv6j3hT14UH",
    cooldown: 0
  },

  "romania": {
    name: "Romania",
    invite: "https://discord.gg/0isAY5pA7nPL59JU",
    cooldown: 0
  },

  "russia": {
    name: "Russia",
    invite: "https://discord.gg/0b1KVm67Vmzy0Giv",
    cooldown: 0
  },

  "serbia": {
    name: "Serbia",
    invite: "https://discord.gg/0dI9syWXyoRJ12Jn",
    cooldown: 0
  },

  "singapore": {
    name: "Singapore",
    invite: "https://discord.gg/0dI9JQdkEAtjsSjl",
    cooldown: 0
  },

  "slovakia": {
    name: "Slovakia",
    invite: "https://discord.gg/0dI8sDtu83gHKelq",
    cooldown: 0
  },

  "south africa": {
    name: "South Africa",
    invite: "https://discord.gg/0rAw9ICnyIepqwSl",
    cooldown: 0
  },

  "south korea": {
    name: "South Korea",
    invite: "https://discord.gg/0beSC9ID5k0l1WPt",
    cooldown: 0
  },

  "spain": {
    name: "Spain",
    invite: "https://discord.gg/0b1JzGvEl0klFn1j",
    cooldown: 0
  },

  "sweden": {
    name: "Sweden",
    invite: "https://discord.gg/0Zfrwm7kiUThImbK",
    cooldown: 0
  },

  "switzerland": {
    name: "Switzerland",
    invite: "https://discord.gg/0b1JlqmGy0dCMp4m",
    cooldown: 0
  },

  "taiwan": {
    name: "Taiwan",
    invite: "https://discord.gg/0b1JYAEdSI0hmwFf",
    cooldown: 0
  },

  "thailand": {
    name: "Thailand",
    invite: "https://discord.gg/0hTNRzyTmIeh3bPw",
    cooldown: 0
  },

  "turkey": {
    name: "Turkey",
    invite: "https://discord.gg/0b1JJlYzeLWFJU4E",
    cooldown: 0
  },

  "uae": {
    name: "UAE",
    invite: "https://discord.gg/0b1JDsT2krXUctNY",
    cooldown: 0
  },

  "uk": {
    name: "UK",
    invite: "https://discord.gg/0ZRKsDlRUCrMljdi",
    cooldown: 0
  },

  "ukraine": {
    name: "Ukraine",
    invite: "https://discord.gg/0b1J65hvvp5REfvZ",
    cooldown: 0
  },

  "uruguay": {
    name: "Uruguay",
    invite: "https://discord.gg/0b1IY52JEs8JRZAs",
    cooldown: 0
  },

  "usa": {
    name: "USA",
    invite: "https://discord.gg/tmCtmxZ",
    cooldown: 0
  },

  "venezuela": {
    name: "Venezuela",
    invite: "https://discord.gg/0b1GeMhOWFw0WOvh",
    cooldown: 0
  },

  "vietnam": {
    name: "Vietnam",
    invite: "https://discord.gg/0Zyk8AMOT1Pzyy7E",
    cooldown: 0
  }
};

// All the commands are located here
var commands = {
  "introduce": {
    name: "introduce",
    description: "Displays some info about myself.",
    extendedhelp: "Tells you a little bit of information about myself.",
    process: function(bot, message, suffix) {
      var msgArray = [];
      msgArray.push("Hello, I'm " + bot.user.username + "! It's a pleasure to meet you ^-^");
      msgArray.push("To see what I can do, use `" + prefix + "help`");
      msgArray.push("If you have any questions, feel free to ask my creator Visate :blush:");
      message.channel.sendMessage(msgArray);
    }
  },

  "help": {
    name: "help",
    usage: "[command]",
    description: "Displays a help message or specific help for a command.",
    extendedhelp: "Displays a help message, and can also be used to display specific help for a command.",
    process: function(bot, message, suffix) {
      // General help message
      var member = message.member;
      if (!suffix) {
        var msgArray = [];

        for (var key in commands) {
          if (!commands.hasOwnProperty(key)) continue;
          let command = commands[key];
          if (!checkPerms(command, message)) continue;

          let info = prefix + command.name;
          if (command.hasOwnProperty('usage')) info += " " + command.usage;
          info += "\n\t" + command.description + "\n";
          msgArray.push(info);
        }

        member.sendMessage(":heart:  __**Your guide to using Ruby**__  :heart:\n```\n" + msgArray.join("\n") + "```");
        message.channel.sendMessage(":mailbox_with_mail: The commands have been direct messaged to you! :heart:");

      }
      // Searches commands list for command then displays specific help
      else if (suffix) {
        if (commands.hasOwnProperty(suffix)) {
          let command = commands[suffix];
          if (!checkPerms(command, message)) {
            message.channel.sendMessage("You don't have sufficient permissions to use the command `" + suffix + "`!");
            return;
          }

          let info = "**[Command]:**       " + command.name;
          info += "\n**[Usage]:**              " + command.name;
          if (command.hasOwnProperty('usage')) info += " " + command.usage;
          info += "\n\n" + command.extendedhelp;
          message.channel.sendMessage(info);
        }
        else {
          message.channel.sendMessage("That command doesn't exist! Try again~");
        }
      }
    }
  },

  "debug": {
    name: "debug",
    description: "For testing random code defined in the bot.",
    extendedhelp: "Tests random code defined in this command to see its result. Only usable by Visate.",
    visateOnly: true,
    process: function(bot, message, suffix) {
      if (message.author.id === '97198953430257664') {
        // runs the code
        try {
          message.channel.sendMessage(eval(suffix));
        } catch (err) {
          message.channel.sendMessage("```js\n" + err + "\n```");
        }
      }
    }
  },

  "music": {
    name: "music",
    alias: "m",
    description: "Music module commands, " + prefix + "music help",
    extendedhelp: "All music module commands are in this module, use `" + prefix + "music help` to a complete list of all the commands.",
    process: function(bot, message, suffix) {
      let request = require('request');
      let guild = message.guild;
      let subCmds = ["join", "leave", "stream", "play", "stop", "pause", "resume", "skip", "np", "queue", "volume"];
      let baseCmd = suffix.toLowerCase().split(" ")[0];
      let djPerms = checkPerms({modOnly: true}, message);
      let connInfo = musicConnections[guild.id];
      let connection = null;
      if (connInfo !== null && connInfo !== undefined && connInfo.vChannel !== null && connInfo.vChannel !== undefined) {
        connection = connInfo.vChannel.connection;
      }

      let play = (song) => {
        if (musicConnections[guild.id] === null || musicConnections[guild.id] === undefined) return;
        else if (song === null || song === undefined) {
          connInfo.tChannel.sendMessage("Queue is empty! Better add some more songs~");
          connInfo.playing = false;
          return;
        }
        connInfo.tChannel.sendMessage(`Playing **${song.title}** (${song.length}) requested by **${song.requestedBy}**`);
        let stream;
        if (song.source === "youtube") {
          stream = ytdl(song.url, {filter: 'audioonly'});
        }
        else if (song.source === "soundcloud") {
          stream = request(song.url);
        }
        connInfo.dispatcher = connection.playStream(stream, {volume: connInfo.volume / 50, passes: 2});
        connInfo.playing = true;

        connInfo.dispatcher.on('end', () => {
          connInfo.queue.shift();
          play(connInfo.queue[0]);
        });

        connInfo.dispatcher.on('error', (err) => {
          connInfo.tChannel.sendMessage(`Error occured during playback: ${err}`);
          connInfo.queue.shift();
          play(connInfo.queue[0]);
        });
      };

      if (subCmds.includes(baseCmd) && baseCmd !== "join" && (connInfo === null || connInfo === undefined)) {
        message.channel.sendMessage(`I haven't joined a voice channel yet! Summon me to a voice channel with \`${prefix}music join\` first!`);
        return;
      }
      if (baseCmd === "join" && djPerms) {
        if (message.member.voiceChannel !== null && message.member.voiceChannel !== undefined) {
          if (connInfo !== null && connInfo !== undefined && connInfo.vChannel.id === message.member.voiceChannel.id) {
            message.channel.sendMessage("I've already joined this voice channel!");
            return;
          }
          message.member.voiceChannel.join();
          musicConnections[guild.id] = {
            vChannel: message.member.voiceChannel,
            tChannel: message.channel,
            volume: ConfigFile.default_volume,
            dispatcher: null,
            streaming: false,
            playing: false,
            skipVote: 0,
            skipRequired: 0,
            queue: []
          };
          message.channel.sendMessage(`Connected to voice channel ${message.member.voiceChannel.name} and binding to ${message.channel}.`);
        }
        else {
          message.channel.sendMessage("Please join a voice channel first then use the command! :heart:");
        }
      }
      else if (baseCmd === "leave" && djPerms) {
        if (message.member.voiceChannel !== connInfo.vChannel) return message.channel.sendMessage("You aren't connected to the voice channel!");
        if (connection !== null && connection !== undefined) {
          connection.disconnect();
        }
        musicConnections[guild.id] = undefined;
        message.channel.sendMessage("Disconnected from voice!");
      }
      else if (baseCmd === "stream" && djPerms) {
        let stream = request('https://stream.r-a-d.io/main.mp3');
        connInfo.dispatcher = connection.playStream(stream, {volume: connInfo.volume / 50, passes: 2});
        connInfo.streaming = true;
        connInfo.playing = false;
        connInfo.queue = [];
        message.channel.sendMessage("Starting stream from r-a-d.io~");
      }
      else if (baseCmd === "play" && djPerms) {
        let songQuery = suffix.substring(4).trim();
        if (songQuery.includes("youtube") || songQuery.includes("youtu.be")) {
          // Youtube streaming
          ytdl.getInfo(songQuery, (err, info) => {
            if (err) {
              message.channel.sendMessage("Error occured on adding song!: " + err);
              return;
            }
            let totalSec = parseInt(info['length_seconds'], 10);
            let min = ~~(totalSec / 60);
            let sec = totalSec % 60;
            if (sec < 10) {
              sec = `0${sec}`;
            }
            let song = {
              title: info['title'],
              requestedBy: message.author.username,
              length: `${min}:${sec}`,
              url: songQuery,
              source: "youtube"
            };
            connInfo.queue.push(song);
            let position = "Up next!";
            if (connInfo.queue.length > 1) position = connInfo.queue.length - 1;
            message.channel.sendMessage(`Queued **${song.title}** (${song.length}) requested by **${song.requestedBy}**~ Position in queue: ${position}`);
            if (!connInfo.playing) play(song);
          });
        }
        else if (songQuery.includes("soundcloud")) {
          // Soundcloud streaming
          request('https://api.soundcloud.com/resolve?url=' + songQuery + "&client_id=" + soundcloudId, (error, response, body) => {
            if (error) {
              message.channel.sendMessage("Error occured on adding song!: " + err);
              return;
            }
            else if (!error && response.statusCode === 200) {
              let jsonObj = JSON.parse(body);
              let milliSec = parseInt(jsonObj['duration'], 10);
              let totalSec = ~~(milliSec / 1000);
              let min = ~~(totalSec / 60);
              let sec = totalSec % 60;
              if (sec < 10) {
                sec = `0${sec}`;
              }
              let song = {
                title: jsonObj['title'],
                requestedBy: message.author.username,
                length: `${min}:${sec}`,
                url: `${jsonObj['stream_url']}?client_id=${soundcloudId}`,
                source: "soundcloud"
              };
              connInfo.queue.push(song);
              let position = "Up next!";
              if (connInfo.queue.length > 1) position = connInfo.queue.length - 1;
              message.channel.sendMessage(`Queued **${song.title}** (${song.length}) requested by **${song.requestedBy}**~ Position in queue: ${position}`);
              if (!connInfo.playing) play(song);
            }
          });
        }
        else {
          // Youtube search
          // temp placeholder
          message.channel.sendMessage("Please provide a YouTube or Soundcloud link!");
        }
      }
      else if (baseCmd === "stop" && djPerms) {
        if (connInfo) {
          message.channel.sendMessage("Music has been stopped!");
          connInfo.streaming = false;
          connInfo.playing = false;
          connInfo.queue = [];
          connInfo.dispatcher.end();
        }
      }
      else if (baseCmd === "pause" && djPerms) {
        if (connInfo.streaming) return;
        message.channel.sendMessage("Paused!");
        connInfo.dispatcher.pause();
      }
      else if (baseCmd === "resume" && djPerms) {
        message.channel.sendMessage("Resumed!");
        connInfo.dispatcher.resume();
      }
      else if (baseCmd === "skip") {
        if (djPerms) {
          message.channel.sendMessage("Skipped!");
          connInfo.dispatcher.end();
        }
        else if (!guild.name.startsWith('~Nyaa')){
          let unmutedCount = connInfo.vChannel.members.filter(m => !m.selfDeaf && !m.serverDeaf && m.id !== bot.user.id).size;
          connInfo.skipRequired = ~~(unmutedCount * 0.3);
          connInfo.skipVote += 1;
          if (connInfo.skipVote >= connInfo.skipRequired) {
            connInfo.skipVote = 0;
            message.channel.sendMessage("Skipped!");
            connInfo.dispatcher.end();
          }
          else {
            message.channel.sendMessage(`Vote to skip acknowledged! Required votes to skip: \`${connInfo.skipVote}/${connInfo.skipRequired}\``);
          }
        }
      }
      else if (baseCmd === "np") {
        if (connInfo.streaming) {
          request("https://r-a-d.io/api", function(error, response, body) {
            if (!error && response.statusCode === 200) {
              let jsonObj = JSON.parse(body);
              message.channel.sendMessage(`Now streaming from r-a-d.io in ${connInfo.vChannel.name}: **${jsonObj['main']['np']}**`);
            }
          });
        }
        else if (connInfo.playing) {
          let milliSec = connInfo.dispatcher.time;
          let totalSec = ~~(milliSec / 1000);
          let min = ~~(totalSec / 60);
          let sec = totalSec % 60;
          if (sec < 10) {
            sec = `0${sec}`;
          }
          message.channel.sendMessage(`Now playing in ${connInfo.vChannel.name}: **${connInfo.queue[0].title}** requested by **${connInfo.queue[0].requestedBy}** \`[${min}:${sec}/${connInfo.queue[0].length}]\``);
        }
        else {
          message.channel.sendMessage(`Nothing is playing right now!`);
        }
      }
      else if (baseCmd === "queue") {
        if (connInfo.streaming) {
          request("https://r-a-d.io/api", function(error, response, body) {
            if (!error && response.statusCode === 200) {
              let jsonObj = JSON.parse(body);
              let streamQueue = jsonObj['main']['queue'];
              let msgArray = [];
              msgArray.push(`Now streaming from r-a-d.io in ${connInfo.vChannel.name}: **${jsonObj['main']['np']}**\n`);
              msgArray.push(`__Upcoming songs:__`);
              for (let i in streamQueue) {
                msgArray.push(`**${parseInt(i, 10) + 1}:**  ${streamQueue[i]['meta']}`);
              }
              message.channel.sendMessage(msgArray.join("\n"));
            }
          })
        }
        else if (connInfo.playing) {
          let playQueue = connInfo.queue;
          let msgArray = [];
          let milliSec = connInfo.dispatcher.time;
          let totalSec = ~~(milliSec / 1000);
          let min = ~~(totalSec / 60);
          let sec = totalSec % 60;
          if (sec < 10) {
            sec = `0${sec}`;
          }
          msgArray.push(`Now playing in ${connInfo.vChannel.name}: **${playQueue[0].title}** requested by **${playQueue[0].requestedBy}** \`[${min}:${sec}/${playQueue[0].length}]\`\n`);
          if (playQueue.length > 1) {
            msgArray.push(`__Upcoming songs:__`);
            for (let i = 1; i < playQueue.length; i++) {
              msgArray.push(`**${i}:** ${playQueue[i].title} (${playQueue[i].length}) requested by ${playQueue[i].requestedBy}`);
            }
          }
          message.channel.sendMessage(msgArray.join("\n"));
        }
        else {
          message.channel.sendMessage("Nothing is playing right now!");
        }
      }
      else if (baseCmd === "volume") {
        let volumeQuery = Math.round(parseInt(suffix.substring(6), 10));
        if (djPerms && volumeQuery !== "" && !isNaN(volumeQuery)) {
          if (volumeQuery > 100) volumeQuery = 100;
          else if (volumeQuery < 0) volumeQuery = 0;
          connInfo.volume = volumeQuery;
          if (connInfo.dispatcher !== null && connInfo.dispatcher !== undefined) connInfo.dispatcher.setVolume(volumeQuery / 50);
        }
        let filled = "▓";
        let unfilled = "░";
        let count = Math.round(connInfo.volume / 5);
        let volumeBar = Array(count + 1).join(filled) + Array(21 - count).join(unfilled);
        message.channel.sendMessage(`Volume: ${connInfo.volume} [${volumeBar}]`);
      }
      else {
        if (baseCmd === "help") {
          let cmdName = "";
          let usage = "";
          let information = "";
          let subCmd = suffix.substring(5).trim();
          if (subCmd === "join") {

          }
        }
      }
    }
  },

  "restart": {
    name: "restart",
    description: "Restarts Ruby.",
    extendedhelp: "Restarts Ruby by sending an exit code, only works if bot was launched with forever.",
    visateOnly: true,
    process: function(bot, message, suffix) {
      message.channel.sendMessage("Be right back~ :heart:").then(() => {
        process.exit(0);
      });
    }
  },

  "shutdown": {
    name: "shutdown",
    description: "Shuts down Ruby.",
    extendedhelp: "Shuts down Ruby by sending exit code 21.",
    visateOnly: true,
    process: function(bot, message, suffix) {
      message.channel.sendMessage("Bye bye~ :heart:").then(() => {
        process.exit(21);
      });
    }
  },

  "purge": {
    name: "purge",
    usage: "<number of messages>",
    description: "Deletes a certain amount of messages from chat.",
    extendedhelp: "I will delete a certain amount of messages from chat.",
    upOnly: true,
    requiredPerms: ["MANAGE_MESSAGES"],
    process: function(bot, message, suffix) {
      if (!suffix) {
        message.channel.sendMessage("Please define an amount of messages for me to delete!");
        return;
      }

      if (isNaN(suffix)) {
        message.channel.sendMessage("Please define an amount of messages for me to delete!");
        return;
      }

      suffix = parseInt(suffix, 10);

      /*if (!message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")) {
        message.channel.sendMessage("Sorry, you don't have permission to delete messages!");
        return;
      }

      if (!message.channel.permissionsFor(bot.user).hasPermission("MANAGE_MESSAGES")) {
        message.channel.sendMessage("I don't have permission to delete messages here!");
        return;
      }*/

      if (suffix > 2000) return message.channel.sendMessage("Sorry, I cannot delete more than 2000 messages.");
      else if (suffix > 100) {
        let delMsgs = (id) => {
          let delCount = 0;
          if (msgsCount > 100) {
            msgsCount -= 100;
            delCount = 100;
          } else if (msgsCount > 0 && msgsCount <= 100) {
            delCount = msgsCount;
            msgsCount = 0;
          }

          if (delCount > 0) {
            channel.fetchMessages({limit: delCount, before: id}).then(msgs => {
              channel.bulkDelete(msgs).then(() => delMsgs(msgs.last().id));
            });
          }
        }
        let channel = message.channel;
        let collector = channel.createCollector(m => m.author === message.author, {time: 30000});
        let msgsCount = suffix;
        channel.sendMessage(`You are about to delete ${suffix} messages. This action is not reversible. Are you sure you want to continue? (yes/no)`);

        collector.on('message', message => {
          if (message.content.toLowerCase() === "yes") collector.stop('delete');
          else if (message.content.toLowerCase() === "no") collector.stop('abort');
        });

        collector.on('end', (collection, reason) => {
          if (reason === "abort") return channel.sendMessage("Cancelled~");
          else if (reason === "time") return channel.sendMessage("Time's up! Purge cancelled~");
          else if (reason === "delete") {
            msgsCount += 2;
            let lastmsg = collection.last();
            delMsgs(lastmsg.id);
            lastmsg.delete();
          }
        });
      }
      else if (suffix > 0) {
        message.delete().then(msg => msg.channel.bulkDelete(suffix));
      }
    }
  },

  "togglemode": {
    name: "togglemode",
    description: "In case of a Nyaabot outage, allow Ruby to take over.",
    extendedhelp: "In case of a Nyaabot outage, this allows Ruby to perform the tasks that Nyaabot normally would.",
    upOnly: true,
    nyaaOnly: true,
    process: function(bot, message, suffix) {
      if (ConfigFile.backup_mode) {
        ConfigFile.backup_mode = false;
      }
      else if (!ConfigFile.backup_mode) {
        ConfigFile.backup_mode = true;
      }

      fs.writeFileSync('./config.json', JSON.stringify(ConfigFile, null, 2));
      if (ConfigFile.backup_mode) {
        message.channel.sendMessage("I'm ready! ^-^");
      }
      else if (!ConfigFile.backup_mode) {
        message.channel.sendMessage("My job here is done. ^-^");
      }
    }
  },

  "tablepanic": {
    name: "tablepanic",
    description: "In case of a tablebot outage, allow Ruby to take over.",
    extendedhelp: "In case of a tablebot outage, this allows Ruby to perform the tasks that tablebot normally would.",
    upOnly: true,
    nyaaOnly: true,
    process: function(bot, message, suffix) {
      if (ConfigFile.tablepanic) {
        ConfigFile.tablepanic = false;
      }
      else if (!ConfigFile.tablepanic) {
        ConfigFile.tablepanic = true;
      }

      fs.writeFileSync('./config.json', JSON.stringify(ConfigFile, null, 2));
      if (ConfigFile.tablepanic) {
        message.channel.sendMessage("Everybody panic!");
      }
      else if (!ConfigFile.tablepanic) {
        message.channel.sendMessage("Alright panic over, back to normal friends ^-^");
      }
    }
  },

  "say": {
    name: "say",
    usage: "<message to say>",
    description: "Makes me say something!",
    extendedhelp: "I'll say your message as mine and try to delete your message too~",
    visateOnly: true,
    process: function(bot, message, suffix) {
      let channel = message.channel;
      message.delete();
      message.channel.sendMessage(suffix);
    }
  },

  "gmanagerole": {
    name: "gmanagerole",
    usage: "<add|remove> <userid or mention> <role>",
    description: "Assigns a role to a user across all servers.",
    extendedhelp: "Assigns a role to a user across all ~Nyaa servers, as long as that role exists.",
    alternateInvoke: true,
    upOnly: true,
    nyaaOnly: true,
    requiredPerms: ["MANAGE_ROLES_OR_PERMISSIONS"],
    process: function(bot, message, suffix) {
      if (!suffix) {
        message.channel.sendMessage("Please specify an action, user, and role~");
        return;
      }
      var splitSuffix = suffix.split(" ");
      if (splitSuffix.length < 3) {
        message.channel.sendMessage("Please specify an action, user, and role~");
      }
      if (splitSuffix.length >= 3) {
        var action = splitSuffix[0].toLowerCase();
        var userQuery = splitSuffix[1];
        var roleQuery = suffix.substring(action.length + userQuery.length + 2).toLowerCase();

        if (userQuery.startsWith('<@')) {
          userQuery = userQuery.substring(2, userQuery.length - 1);
        }
        if (isNaN(userQuery)) {
          message.channel.sendMessage("You did not specify a user correctly! Only provide a mention or a user id. Please try again~");
        }

        var nyaaGuilds = bot.guilds.filter(guild => guild.name.startsWith("~Nyaa")).array();

        var roleLoop = new Promise(function(resolve, reject) {
          var roleName;
          var memberName;
          var serverCount = 0;
          var count = 0;
          console.log("entering role loop with action " + action + " userQuery " + userQuery + " roleQuery " + roleQuery);
          var returnPromise = function(serverCount, guildLength) {
            if (serverCount === guildLength) {
              if (count === 0) {
                reject({role: roleName, member: memberName});
              } else {
                resolve({count: count, role: roleName, member: memberName});
              }
            }
          };

          for (var i_guild in nyaaGuilds) {

            let guild = nyaaGuilds[i_guild];

            let member = guild.members.find(member => member.id === userQuery);
            if (member === null || member === undefined) {
              serverCount++;
              returnPromise(serverCount, nyaaGuilds.length);
              continue;
            }
            if (typeof memberName !== 'string') memberName = member.user.username;

            let role = guild.roles.find(role => role.name.toLowerCase() === roleQuery);
            if (role === null || role === undefined) {
              serverCount++;
              returnPromise(serverCount, nyaaGuilds.length);
              continue;
            }
            if (typeof roleName !== 'string') roleName = role.name;

            if (action === "add") {
              member.addRole(role).then(function(member) {
                count++;
                serverCount++;
                console.log("count: " + count + " added successfully in guild: " + member.guild.name + " | member: " + member.user.username + " | role: " + role.name);
                returnPromise(serverCount, nyaaGuilds.length);
              });
            }
            else if (action === "remove") {
              member.removeRole(role).then(function(member) {
                count++;
                serverCount++;
                console.log("count: " + count + " removed successfully in guild: " + member.guild.name + " | member: " + member.user.username + " | role: " + role.name);
                returnPromise(serverCount, nyaaGuilds.length);
              });
            }
          }
        });

        roleLoop.then(function(params) {
          if (action === "add") {
            message.channel.sendMessage(message.author + ", added " + params.role + " to " + params.member + " across " + params.count + " servers.");
          } else if (action === "remove") {
            message.channel.sendMessage(message.author + ", removed " + params.role + " from " + params.member + " across " + params.count + " servers.");
          }
        }).catch(function() {
          message.channel.sendMessage(message.author + ", unable to find user or role in the servers.");
        });
      }
    }
  },

  "vkick": {
    name: "vkick",
    usage: "<user query>",
    description: "Kicks a user from a voice channel",
    extendedhelp: "Creates a new voice channel, moves that user to that channel and then deletes the channel, effectively kicking the user from voice.",
    requiredPerms: ["MOVE_MEMBERS", "MANAGE_CHANNELS"],
    teOnly: true,
    process: function(bot, message, suffix) {
      let guild = message.guild;
      let userQuery = "";
      let member;
      if (suffix.startsWith("<@!")) {
        userQuery = suffix.substring(3, suffix.length - 1);
      } else if (suffix.startsWith("<@")) {
        userQuery = suffix.substring(2, suffix.length - 1);
      } else {
        userQuery = suffix;
      }

      function vkick(member) {
        guild.createChannel(makeid(), "voice").then(channel => {
          member.setVoiceChannel(channel).then(m => {
            channel.delete();
            message.channel.sendMessage("^-^");
          });
        });
      }

      function makeid() {
          let text = "";
          let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for (let i = 0; i < 10; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));

          return text;
      }

      if (!isNaN(userQuery)) {
        member = guild.members.find(m => m.id === userQuery && m.voiceChannel !== null && m.voiceChannel !== undefined);
        if (member !== null && member !== undefined) {
          vkick(member);
        } else {
          message.channel.sendMessage("No voice users were found with this user query, try something else~");
        }
      } else {
        let membersUsername = guild.members.filter(m => m.user.username.toLowerCase().includes(userQuery.toLowerCase()) && m.voiceChannel !== null && m.voiceChannel !== undefined).array();
        let membersNickname = guild.members.filter(m => m.nickname !== null && m.nickname.toLowerCase().includes(userQuery.toLowerCase()) && m.voiceChannel !== null && m.voiceChannel !== undefined).array();
        let members = [];
        let idsArray = [];

        for (let i_name in membersUsername) {
          members.push(membersUsername[i_name]);
          idsArray.push(membersUsername[i_name].id);
        }

        for (let i_nick in membersNickname) {
          if (idsArray.includes(membersNickname[i_nick].id)) continue;
          members.push(membersNickname[i_nick]);
          idsArray.push(membersNickname[i_nick].id);
        }

        if (members.length === 0) {
          message.channel.sendMessage("No voice users were found with this user query, try something else~");
        }
        else if (members.length === 1) {
          member = members[0];
        }
        else {
          let msgArray = [];
          msgArray.push("Multiple users with that search were found, run the command again with `" + prefix + "vkick <id>`");
          for (let i_member in members) {
            let member = members[i_member];
            let userStr = "**" + member.user.username;
            if (member.nickname !== null) {
              userStr += " (" + member.nickname + "):** ";
            }
            else {
              userStr += ":** ";
            }
            msgArray.push(userStr + member.id);
          }
          message.channel.sendMessage(msgArray);
          return;
        }

        if (member !== null && member !== undefined) {
          vkick(member);
        } else {
          message.channel.sendMessage("No voice users were found with this user query, try something else~");
        }
      }
    }
  },

  "warn": {
    name: "warn",
    usage: "<mention> <reason>",
    description: "Issues a warning to a user and posts in a log channel, if it exists.",
    extendedhelp: "Creates a case message in the mod log warning the user. Invoke this in the channel it occured in with a mention and include your reason.",
    alternateInvoke: true,
    trialModOnly: true,
    nyaaOnly: true,
    process: function(bot, message, suffix) {
      var guild = message.guild;

      var userQuery = suffix.split(" ")[0];
      var reason = suffix.substring(userQuery.length + 1);
      console.log("Warn action with params usermention: " + userQuery + " and reason: " + reason);
      var userid;

      if (userQuery.startsWith("<@!")) {
        userid = userQuery.substring(3,  userQuery.length - 1);
      } else if (userQuery.startsWith("<@")) {
        userid = userQuery.substring(2, userQuery.length - 1);
      }

      var member = guild.members.find(member => member.id === userid);
      var rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");

      if (!suffix) {
        message.channel.sendMessage(message.author + ", please provide a user mention and a reason~");
        return;
      }
      if (!userQuery.startsWith("<@")) {
        message.channel.sendMessage(message.author + ", please mention the user you are warning~");
        message.delete();
        return;
      }
      if (reason === "") {
        message.channel.sendMessage(message.author + ", please include a reason in your report~");
        message.delete();
        return;
      }
      if (rubyLogCh === null || rubyLogCh === undefined) {
        message.channel.sendMessage(message.author + ", I can't find the log channel!");
        return;
      }

      var caseNum;
      rubyLogCh.fetchMessages({limit: 1}).then(function(messages) {
        if (messages.array().length === 0) {
          caseNum = 1;
        } else {
          var caseMsg = messages.array()[0];
          var caseTxt = caseMsg.content.split("\n")[0];
          caseNum = parseInt(caseTxt.substring(21, caseTxt.indexOf(" |")), 10) + 1;
        }

        var msgArray = [];
        msgArray.push("**Case:**             " + caseNum + " | Warning");
        msgArray.push("**Channel:**       " + message.channel.name);
        msgArray.push("**Mod:**             " + message.author.username + "#" + message.author.discriminator);
        msgArray.push("**User:**             " + member.user.username + "#" + member.user.discriminator + " (" + member.id + ")");
        msgArray.push("**Reason:**        " + reason);

        rubyLogCh.sendMessage(msgArray.join("\n"));
        message.channel.sendMessage("^-^");
      });
    }
  },

  "kick": {
    name: "kick",
    usage: "<userid or mention> <reason>",
    description: "Kicks the user, PMs them the reason with an invite link, and logs it.",
    extendedhelp: "Kicks the specified user from the server and creates a case message in the mod log, along with PMing an invite link and reason. Invoke this with a mention and include your reason.",
    alternateInvoke: true,
    adminOnly: true,
    nyaaOnly: true,
    corecraftEnable: true,
    process: function(bot, message, suffix) {
      var guild = message.guild;

      if (guild.name.startsWith("~Nyaa")) {
        var userQuery = suffix.split(" ")[0];
        var reason = suffix.substring(userQuery.length + 1);
        console.log("Kick action with params usermention: " + userQuery + " and reason: " + reason);

        if (userQuery.startsWith("<@!")) {
          userQuery = userQuery.substring(3,  userQuery.length - 1);
        } else if (userQuery.startsWith("<@")) {
          userQuery = userQuery.substring(2, userQuery.length - 1);
        }

        var member = guild.members.find(member => member.id === userQuery);
        var rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");

        if (!suffix) {
          message.channel.sendMessage(message.author + ", please provide a user mention and a reason~");
          return;
        }
        if (isNaN(userQuery)) {
          message.channel.sendMessage(message.author + ", please provide a valid user mention or userid~");
          return;
        }
        if (reason === "") {
          message.channel.sendMessage(message.author + ", please include a reason in your report~");
          message.delete();
          return;
        }
        if (rubyLogCh === null || rubyLogCh === undefined) {
          message.channel.sendMessage(message.author + ", I can't find the log channel!");
          let msgPM = [];
          msgPM.push("Oh no! It appears that you have been kicked by " + message.author.username + ".");
          msgPM.push("**The reason:** " + reason);
          msgPM.push("\nIf you feel that this was unjust, feel free to talk to NyaaKoneko#1495 about it. You are welcome to join back with this link, please behave this time~ :heart:");
          guild.fetchInvites().then(function(invites) {
            let invite = invites.find(invite => invite.maxAge === 0 && invite.temporary === false);
            if (invite === null | invite === undefined) {
              let lobby = guild.channels.find(channel => channel.name === "casual-lobby");
              lobby.createInvite({maxAge: 0}).then(function(inviteLobby) {
                msgPM.push(inviteLobby.url);
              });
            }
            else {
              msgPM.push(invite.url);
            }

            member.sendMessage(msgPM.join("\n")).then(function() {
              member.kick();
            });
          });
          return;
        }


        var caseNum;
        rubyLogCh.fetchMessages({limit: 1}).then(function(messages) {
          if (messages.array().length === 0) {
            caseNum = 1;
          } else {
            var caseMsg = messages.array()[0];
            var caseTxt = caseMsg.content.split("\n")[0];
            caseNum = parseInt(caseTxt.substring(21, caseTxt.indexOf(" |")), 10) + 1;
          }

          let msgArray = [];
          msgArray.push("**Case:**             " + caseNum + " | Kick");
          msgArray.push("**Channel:**       " + message.channel.name);
          msgArray.push("**Mod:**             " + message.author.username + "#" + message.author.discriminator);
          msgArray.push("**User:**             " + member.user.username + "#" + member.user.discriminator + " (" + member.id + ")");
          msgArray.push("**Reason:**        " + reason);

          rubyLogCh.sendMessage(msgArray.join("\n"));

          let msgPM = [];
          msgPM.push("Oh no! It appears that you have been kicked by " + message.author.username + ".");
          msgPM.push("**Reason:** " + reason);
          msgPM.push("\nIf you feel that this was unjust, feel free to talk to NyaaKoneko#1495 about it. You are welcome to join back with this link, please behave this time~ :heart:");
          guild.fetchInvites().then(function(invites) {
            let invite = invites.find(invite => invite.maxAge === 0 && invite.temporary === false && invite.channel.name === "casual-lobby");
            if (invite === null | invite === undefined) {
              let lobby = guild.channels.find(channel => channel.name === "casual-lobby");
              lobby.createInvite({maxAge: 0}).then(function(inviteLobby) {
                let url = inviteLobby.url;
                msgPM.push(url);
              });
            }
            else {
              msgPM.push(invite.url);
            }

            member.sendMessage(msgPM.join("\n")).then(function() {
              member.kick();
            });
            message.channel.sendMessage("^-^");
          });
        });
      }

      else if (guild.id === coreCraftId) {
        let trainee = guild.roles.find(r => r.name === "Trainee");
        if (message.member.highestRole.position < trainee.position) return message.channel.sendMessage("You have insufficient permissions to run this command!");
        let userQuery = suffix.split(" ")[0];

        if (userQuery.startsWith("<@!")) {
          userQuery = userQuery.substring(3,  userQuery.length - 1);
        } else if (userQuery.startsWith("<@")) {
          userQuery = userQuery.substring(2, userQuery.length - 1);
        }

        if (isNaN(userQuery)) return message.channel.sendMessage('Please use a user mention or id~').then(msg => msg.delete(5000));

        let member = guild.members.find(member => member.id === userQuery);
        let logCh = guild.channels.find(channel => channel.id === "255075023037923329");

        if (member.highestRole.position >= message.member.highestRole.position) return message.channel.sendMessage("You cannot kick this user!");

        if (member === null || member === undefined) return message.channel.sendMessage('Member was not found, try again~').then(msg => msg.delete(5000));

        let msg = `Kick: **${member.user.username}#${member.user.discriminator}** (${member.id}) kicked by **${message.author.username}#${message.author.discriminator}**`;
        logCh.sendMessage(msg);
        member.kick().then(mem => message.channel.sendMessage(`:boot: ${message.author.username} kicked ${mem.user.username}!`).then(msg => msg.delete(5000)));
      }
    }
  },

  "ban": {
    name: "ban",
    usage: "<userid or mention> <reason>",
    description: "Bans the user, PMs them the reason and logs it.",
    extendedhelp: "Bans the specified user from the server and logs it, along with PMing the user the reason and a link to the appeal form. Invoke this with a mention and include a reason.",
    alternateInvoke: true,
    teOnly: true,
    nyaaOnly: true,
    corecraftEnable: true,
    process: function(bot, message, suffix) {
      var guild = message.guild;

      if (guild.name.startsWith("~Nyaa")) {
        var userQuery = suffix.split(" ")[0];
        var reason = suffix.substring(userQuery.length + 1);
        console.log("Ban action with params usermention: " + userQuery + " and reason: " + reason);

        if (userQuery.startsWith("<@!")) {
          userQuery = userQuery.substring(3,  userQuery.length - 1);
        } else if (userQuery.startsWith("<@")) {
          userQuery = userQuery.substring(2, userQuery.length - 1);
        }

        var member = guild.members.find(member => member.id === userQuery);
        var rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");

        if (!suffix) {
          message.channel.sendMessage(message.author + ", please provide a user mention and a reason~");
          return;
        }
        if (isNaN(userQuery)) {
          message.channel.sendMessage(message.author + ", please provide a valid user mention or userid~");
          return;
        }
        if (reason === "") {
          message.channel.sendMessage(message.author + ", please include a reason in your report~");
          message.delete();
          return;
        }
        if (rubyLogCh === null || rubyLogCh === undefined) {
          message.channel.sendMessage(message.author + ", I can't find the log channel!");
          let msgPM = [];
          msgPM.push("Oh no! It appears that you have been banned by " + message.author.username + ".");
          msgPM.push("**Reason:** " + reason);
          msgPM.push("\nIf you feel that this was unjust, feel free to appeal your ban using the form linked below~ :heart:");
          msgPM.push("https://goo.gl/forms/0YX3IVGvmXPylEwD2");
          member.sendMessage(msgPM.join("\n")).then(function() {
            member.ban();
          });
          return;
        }

        var caseNum;
        rubyLogCh.fetchMessages({limit: 1}).then(function(messages) {
          if (messages.array().length === 0) {
            caseNum = 1;
          } else {
            var caseMsg = messages.array()[0];
            var caseTxt = caseMsg.content.split("\n")[0];
            caseNum = parseInt(caseTxt.substring(21, caseTxt.indexOf(" |")), 10) + 1;
          }

          let msgArray = [];
          msgArray.push("**Case:**             " + caseNum + " | Ban");
          msgArray.push("**Channel:**       " + message.channel.name);
          msgArray.push("**Mod:**             " + message.author.username + "#" + message.author.discriminator);
          msgArray.push("**User:**             " + member.user.username + "#" + member.user.discriminator + " (" + member.id + ")");
          msgArray.push("**Reason:**        " + reason);

          rubyLogCh.sendMessage(msgArray.join("\n"));

          let msgPM = [];
          msgPM.push("Oh no! It appears that you have been banned by " + message.author.username + ".");
          msgPM.push("**Reason:** " + reason);
          msgPM.push("\nIf you feel that this was unjust, feel free to appeal your ban using the form linked below~ :heart:");
          msgPM.push("https://goo.gl/forms/0YX3IVGvmXPylEwD2");
          member.sendMessage(msgPM.join("\n")).then(function() {
            member.ban(1);
          });
          message.channel.sendMessage("^-^");
        });
      }

      else if (guild.id === coreCraftId) {
        let jnrMod = guild.roles.find(r => r.name === "Jnr-Mod");
        if (message.member.highestRole.position < jnrMod.position) return message.channel.sendMessage("You have insufficient permissions to run this command!");
        let userQuery = suffix.split(" ")[0];

        if (userQuery.startsWith("<@!")) {
          userQuery = userQuery.substring(3,  userQuery.length - 1);
        } else if (userQuery.startsWith("<@")) {
          userQuery = userQuery.substring(2, userQuery.length - 1);
        }

        if (isNaN(userQuery)) return message.channel.sendMessage('Please use a user mention or id~').then(msg => msg.delete(5000));

        let member = guild.members.find(member => member.id === userQuery);
        let logCh = guild.channels.find(channel => channel.id === "255075023037923329");

        if (member.highestRole.position >= message.member.highestRole.position) return message.channel.sendMessage("You cannot ban this user!").then();

        if (member === null || member === undefined) return message.channel.sendMessage('Member was not found, try again~').then(msg => msg.delete(5000));

        let msg = `Ban: **${member.user.username}#${member.user.discriminator}** (${member.id}) banned by **${message.author.username}#${message.author.discriminator}**`;
        logCh.sendMessage(msg);
        member.ban().then(mem => message.channel.sendMessage(`:hammer: ${message.author.username} banned ${mem.user.username}!`).then(msg => msg.delete(5000)));
      }
    }
  },

  "unban": {
    name: "unban",
    usage: "<userid or username> <reason>",
    description: "Unbans a user, (attempts to) PM an invite link to return and logs it.",
    extendedhelp: "Unbans the user (if multiple users are found with the same name, will send a list instead), tries to PM them a link to return and logs it. Invoke with a userid or username and include a reason.",
    alternateInvoke: true,
    teOnly: true,
    nyaaOnly: true,
    corecraftEnable: true,
    process: function(bot, message, suffix) {
      var guild = message.guild;

      if (guild.name.startsWith("~Nyaa")) {
        var userQuery = suffix.split(" ")[0];
        var reason = suffix.substring(userQuery.length + 1);
        console.log("Unban action with params usermention: " + userQuery + " and reason: " + reason);

        var rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");

        if (!suffix) {
          message.channel.sendMessage(message.author + ", please provide a userid or username and a reason~");
          return;
        }
        if (reason === "") {
          message.channel.sendMessage(message.author + ", please include a reason in your report~");
          message.delete();
          return;
        }
        if (rubyLogCh === null || rubyLogCh === undefined) {
          message.channel.sendMessage(message.author + ", I can't find the log channel!");
          return;
        }

        var caseNum;
        rubyLogCh.fetchMessages({limit: 1}).then(function(messages) {
          if (messages.array().length === 0) {
            caseNum = 1;
          } else {
            var caseMsg = messages.array()[0];
            var caseTxt = caseMsg.content.split("\n")[0];
            caseNum = parseInt(caseTxt.substring(21, caseTxt.indexOf(" |")), 10) + 1;
          }
          let user;
          guild.fetchBans().then(function(bans) {
            if (!isNaN(userQuery)) {
              user = bans.find(user => user.id === userQuery);
            }
            if (user === null || user === undefined) {
              let userArray = bans.filter(user => user.username.toLowerCase().includes(userQuery.toLowerCase())).array();
              if (userArray.length > 1) {
                let msgArray = [];
                msgArray.push(message.author + ", multiple users were found in the ban list with that name. Please run the command with their ID instead~");
                for (let i_user in userArray) {
                  msgArray.push("**" + userArray[i_user].username + ":** " + userArray[i_user].id);
                }
                message.channel.sendMessage(msgArray.join("\n"));
                return;
              } else if (userArray.length === 1) {
                user = userArray[0];
              }
            }

            if (user === null || user === undefined) {
              message.channel.sendMessage("No user was found with that id or username, try again~");
              return;
            }

            let logArray = [];
            logArray.push("**Case:**             " + caseNum + " | Unban");
            logArray.push("**Mod:**             " + message.author.username + "#" + message.author.discriminator);
            logArray.push("**User:**             " + user.username + "#" + user.discriminator + " (" + user.id + ")");
            logArray.push("**Reason:**        " + reason);

            rubyLogCh.sendMessage(logArray.join("\n"));
            guild.unban(user);
            message.channel.sendMessage("^-^");
          });
        });
      }

      else if (guild.id === coreCraftId) {
        let jnrMod = guild.roles.find(r => r.name === "Jnr-Mod");
        if (message.member.highestRole.position < jnrMod.position) return message.channel.sendMessage("You have insufficient permissions to run this command!");
        let userQuery = suffix.split(" ")[0];

        if (!suffix) return message.channel.sendMessage("Please provide a user mention or id~").then(msg => msg.delete(5000));

        if (userQuery.startsWith("<@!")) {
          userQuery = userQuery.substring(3,  userQuery.length - 1);
        } else if (userQuery.startsWith("<@")) {
          userQuery = userQuery.substring(2, userQuery.length - 1);
        }

        if (isNaN(userQuery)) return message.channel.sendMessage('Please use a user mention or id~').then(msg => msg.delete(5000));

        guild.fetchBans().then(bans => {
          let user = bans.find(user => user.id === userQuery);
          let logCh = guild.channels.find(channel => channel.id === "255075023037923329");

          if (user === null || user === undefined) return message.channel.sendMessage('User was not found, try again~').then(msg => msg.delete(5000));

          let msg = `Unban: **${user.username}#${user.discriminator}** (${user.id}) unbanned by **${message.author.username}#${message.author.discriminator}**`;
          logCh.sendMessage(msg);
          guild.unban(user).then(usr => message.channel.sendMessage(`:thumbsup: ${message.author.username} unbanned ${usr.username}!`).then(msg => msg.delete(5000)));
        });
      }
    }
  },

  "gban": {
    name: "gban",
    usage: "<userid or mention> <reason>",
    description: "Globally bans a user across all servers, PMs the reason and logs it.",
    extendedhelp: "Globally bans a user across all Nyaa servers, PMs them the reason and then logs it. Include a reason in the report!",
    alternateInvoke: true,
    upOnly: true,
    nyaaOnly: true,
    process: function(bot, message, suffix) {
      var originGuild = message.guild;
      var nyaaGuilds = bot.guilds.filter(guild => guild.name.startsWith("~Nyaa")).array();
      //var nyaaGuilds = bot.guilds.filter(guild => guild.id === '235144885101920256' || guild.id === '120364073908043785' || guild.id === '228540863058280448').array();
      var pmSent = false;
      var count = 0;
      var cNoBan = 0;

      var userQuery = suffix.split(" ")[0];
      var reason = suffix.substring(userQuery.length + 1);
      console.log(`Gban action with params usermention: ${userQuery} and reason: ${reason}`);

      if (userQuery.startsWith("<@!")) {
        userQuery = userQuery.substring(3, userQuery.length - 1);
      }
      if (userQuery.startsWith("<@")) {
        userQuery = userQuery.substring(2, userQuery.length - 1);
      }

      if (!suffix) {
        message.channel.sendMessage(message.author + ", please provide a userid or mention and a reason~");
        return;
      }
      if (isNaN(userQuery)) {
        message.channel.sendMessage(message.author + ", please provide a valid user mention or userid~");
        return;
      }
      if (reason === "") {
        message.channel.sendMessage(message.author + ", please include a reason in your report~");
        message.delete();
        return;
      }

      var sendPM = function() {
        if (!pmSent) {
          let msgArray = [];
          msgArray.push("Oh no! It appears that you have been global banned by " + message.author.username + ".");
          msgArray.push("**Reason:** " + reason);
          msgArray.push("\nIf you feel that this was unjust, feel free to appeal your ban using the form linked below~ :heart:");
          msgArray.push("https://goo.gl/forms/0YX3IVGvmXPylEwD2");

          member.sendMessage(msgArray.join("\n"));
        }
        pmSent = true;
      };

      var banLoop = function() {
        var promise = new Promise(function(resolve, reject) {

          console.log("entering loop");
          try {
            for (let i_guild in nyaaGuilds) {
              let guild = nyaaGuilds[i_guild];
              console.log(i_guild + ": " + guild.name);
              let rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");
              if (rubyLogCh !== null && rubyLogCh !== undefined) {
                let logArray = [];
                let caseNum = 1;
                rubyLogCh.fetchMessages({limit: 1}).then(function(messages) {
                  if (messages.array().length > 0) {
                    var caseMsg = messages.array()[0];
                    var caseTxt = caseMsg.content.split("\n")[0];
                    caseNum = parseInt(caseTxt.substring(21, caseTxt.indexOf(" |")), 10) + 1;
                  }

                  guild.ban(member.id, 1).then(function(user) {
                    if (member.username === "?" && member.discriminator === "?") {
                      if (typeof user !== "string") {
                        if (member.user !== null && member.user !== undefined) {
                          member = user.user;
                        }
                        else if (member.discriminator !== null && member.discriminator !== undefined) {
                          member = user;
                        }
                        sendPM();
                      }
                    }
                    logArray.push("**Case:**             " + caseNum + " | Global Ban");
                    logArray.push("**Origin:**          " + originGuild.name);
                    logArray.push("**Mod:**             " + message.author.username + "#" + message.author.discriminator);
                    logArray.push("**User:**             " + member.username + "#" + member.discriminator + " (" + member.id + ")");
                    logArray.push("**Reason:**        " + reason);
                    rubyLogCh.sendMessage(logArray.join("\n"));
                    count++;
                    if (count === nyaaGuilds.length && cNoBan === 0) {
                      resolve();
                    } else if (cNoBan > 0 && count === nyaaGuilds.length) {
                      reject();
                    }
                  }).catch(function() {
                    count++;
                    cNoBan++;
                    if (count === nyaaGuilds.length && cNoBan === 0) {
                      resolve();
                    } else if (cNoBan > 0 && count === nyaaGuilds.length) {
                      reject();
                    }
                  });
                });
              } else if (rubyLogCh === null || rubyLogCh === undefined) {
                console.log("no ruby log ch found");
                guild.ban(member.id, 1).then(function(user) {
                  if (member.name === "?" && member.discriminator === "?") {
                    if (typeof user !== "string") {
                      if (member.user !== null && member.user !== undefined) {
                        member = user.user;
                      }
                      else {
                        member = user;
                      }
                      sendPM();
                    }
                  }
                  count++;
                  if (count === nyaaGuilds.length) {
                    resolve();
                  } else if (cNoBan > 0 && count === nyaaGuilds.length) {
                    reject();
                  }
                }).catch(function() {
                  count++;
                  cNoBan++;
                  if (count === nyaaGuilds.length && cNoBan === 0) {
                    resolve();
                  } else if (cNoBan > 0 && count === nyaaGuilds.length) {
                    reject();
                  }
                });
              }
            }
          } catch (error) {
            reject(error);
          }
        });

        return promise;
      };

      var member = originGuild.members.find(member => member.id === userQuery);
      if (member === null || member === undefined) {
        originGuild.fetchBans().then(function(bans) {
          member = bans.find(user => user.id === userQuery);
          if (member === null || member === undefined) {
            member = {username: "?", discriminator: "?", id: userQuery};
          } else {
            sendPM();
          }
          banLoop().then(function(params) {
            message.channel.sendMessage(message.author + ", " + member.username + " (" + member.id + ") was banned on " + count + " servers ^-^");
          }).catch(function() {
            message.channel.sendMessage(message.author + ", " + member.username + " (" + member.id + ") was banned on " + (count - cNoBan) + " servers ^-^ (failed on " + cNoBan + " servers)");
          });
        });
      }

      else {
        member = member.user;
        sendPM();
        banLoop().then(function(params) {
          message.channel.sendMessage(message.author + ", " + member.username + " (" + member.id + ") was banned on " + count + " servers ^-^");
        }).catch(function() {
          message.channel.sendMessage(message.author + ", " + member.username + " (" + member.id + ") was banned on " + (count - cNoBan) + " servers ^-^ (failed on " + cNoBan + " servers)");
        });
      }

    }
  },

  "gunban": {
    name: "gunban",
    usage: "<userid or mention> <reason>",
    description: "Globally unbans a user across all servers and logs it.",
    extendedhelp: "Globally unbans a user across all Nyaa servers and then logs it. Include a reason in the report!",
    alternateInvoke: true,
    upOnly: true,
    nyaaOnly: true,
    process: function(bot, message, suffix) {
      var originGuild = message.guild;
      var nyaaGuilds = bot.guilds.filter(guild => guild.name.startsWith("~Nyaa")).array();
      //var nyaaGuilds = bot.guilds.filter(guild => guild.id === '235144885101920256' || guild.id === '120364073908043785' || guild.id === '228540863058280448').array();
      var count = 0;
      var cNoUnban = 0;

      var userQuery = suffix.split(" ")[0];
      var reason = suffix.substring(userQuery.length + 1);
      console.log("Gunban action with params usermention: " + userQuery + " and reason: " + reason);

      if (userQuery.startsWith("<@!")) {
        userQuery = userQuery.substring(3, userQuery.length - 1);
      }
      if (userQuery.startsWith("<@")) {
        userQuery = userQuery.substring(2, userQuery.length - 1);
      }

      if (!suffix) {
        message.channel.sendMessage(message.author + ", please provide a userid or mention and a reason~");
        return;
      }
      if (isNaN(userQuery)) {
        message.channel.sendMessage(message.author + ", please provide a valid user mention or userid~");
        return;
      }
      if (reason === "") {
        message.channel.sendMessage(message.author + ", please include a reason in your report~");
        message.delete();
        return;
      }

      var unbanLoop = function() {
        var promise = new Promise(function(resolve, reject) {

          console.log("entering loop");
          try {
            for (let i_guild in nyaaGuilds) {
              let guild = nyaaGuilds[i_guild];
              console.log(i_guild + ": " + guild.name);
              let rubyLogCh = guild.channels.find(channel => channel.name === "ruby-log");
              if (rubyLogCh !== null && rubyLogCh !== undefined) {
                let logArray = [];
                let caseNum = 1;
                rubyLogCh.fetchMessages({limit: 1}).then(function(messages) {
                  if (messages.array().length > 0) {
                    var caseMsg = messages.array()[0];
                    var caseTxt = caseMsg.content.split("\n")[0];
                    caseNum = parseInt(caseTxt.substring(21, caseTxt.indexOf(" |")), 10) + 1;
                  }

                  guild.unban(member.id).then(function(user) {
                    if (member.username === "?" && member.discriminator === "?") {
                      if (typeof user !== "string") {
                        if (member.user !== null && member.user !== undefined) {
                          member = user.user;
                        }
                        else if (member.discriminator !== null && member.discriminator !== undefined) {
                          member = user;
                        }
                      }
                    }
                    logArray.push("**Case:**             " + caseNum + " | Global Unban");
                    logArray.push("**Origin:**          " + originGuild.name);
                    logArray.push("**Mod:**             " + message.author.username + "#" + message.author.discriminator);
                    logArray.push("**User:**             " + member.username + "#" + member.discriminator + " (" + member.id + ")");
                    logArray.push("**Reason:**        " + reason);
                    rubyLogCh.sendMessage(logArray.join("\n"));
                    count++;
                    if (count === nyaaGuilds.length && cNoUnban === 0) {
                      resolve();
                    } else if (cNoUnban > 0 && count === nyaaGuilds.length) {
                      reject();
                    }
                  }).catch(function() {
                    count++;
                    cNoUnban++;
                    if (count === nyaaGuilds.length && cNoUnban === 0) {
                      resolve();
                    } else if (cNoUnban > 0 && count === nyaaGuilds.length) {
                      reject();
                    }
                  });
                });
              } else if (rubyLogCh === null || rubyLogCh === undefined) {
                console.log("no ruby log ch found");
                guild.unban(member.id).then(function(user) {
                  if (member.name === "?" && member.discriminator === "?") {
                    if (typeof user !== "string") {
                      if (member.user !== null && member.user !== undefined) {
                        member = user.user;
                      }
                      else {
                        member = user;
                      }
                    }
                  }
                  count++;
                  if (count === nyaaGuilds.length) {
                    resolve();
                  } else if (cNoUnban > 0 && count === nyaaGuilds.length) {
                    reject();
                  }
                }).catch(function() {
                  count++;
                  cNoUnban++;
                  if (count === nyaaGuilds.length && cNoUnban === 0) {
                    resolve();
                  } else if (cNoUnban > 0 && count === nyaaGuilds.length) {
                    reject();
                  }
                });
              }
            }
          } catch (error) {
            reject();
          }
        });
        return promise;
      };

      var member = originGuild.members.find(member => member.id === userQuery);
      if (member === null || member === undefined) {
        originGuild.fetchBans().then(function(bans) {
          member = bans.find(user => user.id === userQuery);
          if (member === null || member === undefined) {
            member = {username: "?", discriminator: "?", id: userQuery};
          }
          unbanLoop().then(function(params) {
            message.channel.sendMessage(message.author + ", " + member.username + " (" + member.id + ") was unbanned on " + count + " servers ^-^");
          }).catch(function() {
            message.channel.sendMessage(message.author + ", " + member.username + " (" + member.id + ") was unbanned on " + (count - cNoUnban) + " servers ^-^ (failed on " + cNoUnban + " servers)");
          });
        });
      }

      else {
        member = member.user;
        unbanLoop().then(function(params) {
          message.channel.sendMessage(message.author + ", " + member.username + " (" + member.id + ") was unbanned on " + count + " servers ^-^");
        }).catch(function() {
          message.channel.sendMessage(message.author + ", " + member.username + " (" + member.id + ") was unbanned on " + (count - cNoUnban) + " servers ^-^ (failed on " + cNoUnban + " servers)");
        });
      }

    }
  },

  "whois": {
    name: "whois",
    usage: "[userid, username or mention (not recommended)]",
    description: "Looks up information about a user.",
    extendedhelp: "I will gather information about a user and display it.",
    process: function(bot, message, suffix) {
      var memberList = message.guild.members;
      var userArray = [];
      var msgArray = [];
      if (!suffix) {
        userArray.push(message.member);
      }
      else if (suffix) {
        if (suffix.startsWith("<@!")) {
          suffix = suffix.substring(3, suffix.length - 1);
          message.channel.sendMessage(message.author + ", you don't need to mention someone in order to use this command, try to avoid that next time~ ^-^");
        }
        else if (suffix.startsWith("<@")) {
          suffix = suffix.substring(2, suffix.length - 1);
          message.channel.sendMessage(message.author + ", you don't need to mention someone in order to use this command, try to avoid that next time~ ^-^");
        }
        if (isNaN(suffix)) {
          let nameArray = memberList.filter(member => member.user.username.toLowerCase().includes(suffix.toLowerCase())).array();
          let nickArray = memberList.filter(member => member.nickname !== null && member.nickname.toLowerCase().includes(suffix.toLowerCase())).array();
          let idsArray = [];

          for (var i_name in nameArray) {
            userArray.push(nameArray[i_name]);
            idsArray.push(nameArray[i_name].id);
          }
          for (var i_nick in nickArray) {
            if (idsArray.includes(nickArray[i_nick].id)) continue;
            userArray.push(nickArray[i_nick]);
            idsArray.push(nickArray[i_nick].id);
          }
        }
        else {
          userArray.push(memberList.find(member => member.id === suffix));
        }
      }

      if (userArray.length > 1) {
        msgArray.push("Multiple users with that search were found, run the command again with `" + prefix + "whois [id]`");
        for (let i_user in userArray) {
          let member = userArray[i_user];
          let userStr = "**" + member.user.username;
          if (member.nickname !== null) {
            userStr += " (" + member.nickname + "):** ";
          }
          else {
            userStr += ":** ";
          }
          msgArray.push(userStr + member.id);
        }
      }
      else if (userArray.length === 1 && userArray[0] !== null && userArray[0] !== undefined) {
        let member = userArray[0];
        msgArray.push("**[User]:**                  `" + member.user.username + "#" + member.user.discriminator + "`");
        msgArray.push("**[ID]:**                      " + member.id);
        if (member.nickname !== null) {
          msgArray.push("**[Nickname]:**        `" + member.nickname + "`");
        }
        let roles =   "**[Roles]**:                ";
        let rolesList = member.roles.array();
        if (rolesList.length === 1) {
          roles += "`@everyone`";
        } else {
          for (var i_role in rolesList) {
            if (rolesList[i_role].name === '@everyone') continue;
            roles += "`" + rolesList[i_role].name + "` ";
          }
        }
        msgArray.push(roles);
        msgArray.push("**[Date Joined]:**    " + member.joinedAt.toUTCString());
        let statusString = "**[Status]:**              ";
        switch (member.presence.status) {
          case "online":
            statusString += "Online";
            break;

          case "offline":
            statusString += "Offline";
            break;

          case "idle":
            statusString += "Idle";
            break;

          case "dnd":
            statusString += "Do Not Disturb";
            break;

          default:
            statusString += "Unknown";
        }
        msgArray.push(statusString);
        let game = member.presence.game;
        if (game !== null && game !== undefined) {
          if (game.streaming) {
            msgArray.push("**[Streaming]:**       " + game.name + " at <" + game.url + ">");
          }
          else {
            msgArray.push("**[Playing]:**            " + game.name);
          }
        }
        msgArray.push("**[Avatar]:**             " + member.user.avatarURL);
      }

      message.channel.sendMessage(msgArray.join("\n"));
    }
  },

  "anime": {
    name: "anime",
    usage: "<anime or id>",
    description: "Searches for info on an anime.",
    extendedhelp: "Searches for the anime on anilist.co. Returns a list of animes if there are multiple. If a specific ID is given, returns that specific anime if it exists.",
    process: function(bot, message, suffix) {
      var msgArray = [];
      var star = '\u2605';

      var gather = function(anime) {
        // sorry hentai fans
        if (anime['adult']) {
          msgArray.push("Sorry, I'm not allowed to display that anime >///<");
          return;
        }

        // determining title
        let title = "";
        let english = anime['title_english'];
        let japanese = anime['title_japanese'];
        if (english === japanese) title += english;
        else title += english + " / " + japanese;

        // determining type
        let type = anime['type'];

        // determining episode count
        let eps = anime['total_episodes'];
        if (eps === 0) eps = "?";
        eps += " eps";

        // formatting min per episode
        let minPerEp = anime['duration'];
        let avgDuration;
        if (typeof minPerEp === 'number') avgDuration = minPerEp;
        else avgDuration = "?";
        avgDuration += " mins/ep";

        // determining airing status and time
        let startDate = "";
        let endDate = "";
        let dateOptions = {year: 'numeric', month: 'short', day: 'numeric'};
        if (anime['start_date_fuzzy'] !== null) {
          let startDateFuzzy = anime['start_date_fuzzy'].toString();
          let startDateX = new Date(startDateFuzzy.replace(/(\d\d\d\d)(\d\d)(\d\d)/, '$1-$2-$3'));
          startDate = startDateX.toLocaleDateString('en-US', dateOptions);
        } else startDate = "?";
        if (anime['end_date_fuzzy'] !== null) {
          let endDateFuzzy = anime['end_date_fuzzy'].toString();
          let endDateX = new Date(endDateFuzzy.replace(/(\d\d\d\d)(\d\d)(\d\d)/, '$1-$2-$3'));
          endDate = endDateX.toLocaleDateString('en-US', dateOptions);
        } else endDate = "?";
        let airingStatus;
        if (typeof anime['airing_status'] === 'string') airingStatus = toTitleCase(anime['airing_status']);
        else airingStatus = '?';
        let airing = airingStatus + " (" + startDate + " - " + endDate + ")";

        // determining source
        let source;
        if (typeof anime['source'] === 'string') source = anime['source'];
        else source = "?";

        // determining season
        let seasonNum = anime['season'];
        let season = "";
        if (typeof seasonNum === 'number') {
          let year = ~~(seasonNum / 10);
          season += "'" + year + " ";
          let quarter = seasonNum % 10;
          switch (quarter) {
            case 1:
              season += "Winter";
              break;
            case 2:
              season += "Spring";
              break;
            case 3:
              season += "Summer";
              break;
            case 4:
              season += "Fall";
              break;
          }
        }
        else season = "?";

        // parse genres
        let genres = "";
        let genresList = anime['genres'];
        for (var i_genre in genresList) {
          genres += genresList[i_genre];
          if (i_genre < genresList.length - 1) {
            genres += ", ";
          }
        }

        // format description
        let description = "**Description:**\n" + entities.decode(anime['description'].replace(/<br>/g, ""));

        // putting the message together
        msgArray.push("**" + title + "**");
        msgArray.push(type + "  " + star + "  " + eps + "  " + star + "  " + avgDuration + "  " + star + "  " + airing);
        msgArray.push("Source: " + source + "  " + star + "  " + "Season: " + season);
        msgArray.push("Genres: " + genres + "  " + star + "  " + "<https://anilist.co/anime/" + anime['id'] + ">\n");
        msgArray.push(description);
      };

      var send = function() {
        if (msgArray.join('\n').length === 0) {
          message.channel.sendMessage("No results were found for your search, try again~");
        }
        else if (msgArray.join('\n').length > 2000) {
          message.channel.sendMessage(msgArray.slice(0, msgArray.length - 1).join("\n"));
          message.channel.sendMessage(msgArray[msgArray.length - 1]);
        }
        else message.channel.sendMessage(msgArray.join("\n"));
      };

      if (!suffix) {
        msgArray.push("Please enter either the id of the anime you're looking for or a search!");
        send();
      }
      else if (isNaN(suffix)) {
        nani.get("anime/search/" + suffix).then(data => {
          if (data.length > 1) {
            msgArray.push("Your search returned multiple anime titles, please run the command again with the ID of the anime you'd like to search up using `" + prefix + "anime [id]`");
            for (var i_data in data) {
              let anime = data[i_data];
              let english = anime['title_english'];
              let japanese = anime['title_japanese'];
              let result = "";
              if (english === japanese) {
                result += english;
              }
              else {
                result += english + " / " + japanese;
              }
              msgArray.push("**" + result + ":** " + anime['id']);
            }
          }
          else if (data.length === 1) gather(data[0]);
          send();
        }).catch(err => {
          console.log("Error searching for anime: " + err);
          msgArray.push("Your search turned up no results, try again~");
          send();
        });
      }
      else if (!isNaN(suffix)) {
        nani.get("anime/" + suffix).then(data => {
          gather(data);
          send();
        }).catch(err => {
          console.log("Error looking up anime by id: " + err);
          msgArray.push("No anime was found with that ID, try again~");
          send();
        });
      }

    }
  },

  "calculate": {
    name: "calculate",
    usage: "<expression>",
    description: "Tries to calculate a given math expression.",
    extendedhelp: "Attempts to calculate a given math expression then returns the result.",
    process: function(bot, message, suffix) {
      if (suffix) {
        try {
          message.channel.sendMessage(suffix + " --> " + mathjs.eval(suffix));
        } catch (err) {
          message.channel.sendMessage(suffix + " --> " + err);
        }
      } else {
        message.channel.sendMessage("Please provide a math statement to calculate~");
      }
    }
  },

  "roll": {
    name: "roll",
    usage: "[(number of dice)d(number of sides) || number || min-max]",
    description: "Rolls a dice, or picks a random number within a range.",
    extendedhelp: "Either rolls a dice with a dice input (ex. 2d6), pick a number from 0 to your number, or pick a number from your minimum to maximum range. Otherwise, rolls a six-sided dice.",
    process: function(bot, message, suffix) {
      suffix = suffix.toLowerCase();
      var request = require('request');
      var diceRoll = dice => {
        request('https://rolz.org/api/?' + dice + '.json', function(error, response, body) {
          if (!error && response.statusCode == 200) {
            var roll = JSON.parse(body);
            message.channel.sendMessage("Rolled **" + roll.result + "** with " + dice);
          }
        });
      };
      if (suffix) {
        if (suffix.includes("d")) {
          diceRoll(suffix);
        } else if (suffix.includes("-")) {
          let min = parseInt(suffix.split("-")[0], 10);
          let max = parseInt(suffix.split("-")[1], 10);
          message.channel.sendMessage("Rolled **" + Math.round(mathjs.random(min, max)) + "** with " + suffix);
        } else if (!suffix.isNaN) {
          message.channel.sendMessage("Rolled **" + Math.round(mathjs.random(parseInt(suffix, 10))) + "** with " + suffix);
        }
      } else {
        diceRoll("d6");
      }
    }
  }
};

bot.on("ready", function() {
  console.log("-------------");
  console.log("Logged in as " + bot.user.username + " (" + bot.user.id + ")");
  console.log("Connected to " + bot.guilds.array().length + " servers.");
  console.log("-------------");
});

bot.on("disconnect", function() {
  console.log("Disconnected from Discord!");
});

bot.on("reconnecting", function() {
  console.log("Attempting reconnection...\n\n");
});

bot.on("guildMemberAdd", function(member) {
  let guild = member.guild;
  if (ConfigFile.backup_mode && (guild.name.startsWith("~Nyaa") || guild.id === '130616817625333761')) {
    let msgArray = [];
    let guestRole = guild.roles.find(role => role.name.toLowerCase() === "guest");
    let rules = guild.channels.find(channel => channel.name === "read-the-rules");
    let help = guild.channels.find(channel => channel.name === "help");
    msgArray.push(member + " has just joined us! **Say hi ヾ(〃^∇^)ﾉ** :heart:");
    msgArray.push("Please " + rules + " and check out the " + help + " channel if you're new to Discord.");
    msgArray.push("If you have any questions feel free to ask the moderation team **(Do not ask NyaaKoneko, she has no time for you)**");
    guild.defaultChannel.sendMessage(msgArray.join("\n"));
    let pmArray = [];
    pmArray.push("Hi " + member.user.username + "!");
    pmArray.push("Welcome to our server - We're excited for you to join us!");
    pmArray.push("We have a few rules here to ensure everyone has a great time, so please go over them in the #read-the-rules channel :heart:");
    pmArray.push("If you have any questions, feel free to ask the moderation team. Also check out the #help channel, as it has a lot of useful information.");
    pmArray.push("Enjoy your stay :heart:");
    member.sendMessage(pmArray.join("\n"));
    member.addRole(guestRole);
  }
  if (guild.name.startsWith("~Nyaa")) {
    let nyaaCh = guild.channels.find(channel => channel.name === "nyaa");
    if (nyaaCh !== null && nyaaCh !== undefined) {
      let msg = "Join: `" + member.user.username + "` (" + member.id + ") at " + new Date().toUTCString();
      nyaaCh.sendMessage(msg);
      console.log(msg + " from " + guild.name);
    }
  }
  if (guild.id === coreCraftId) {
    let logCh = guild.channels.find(channel => channel.name === "log");
    logCh.sendMessage("**Join:** `" + member.user.username + "` (" + member.id + ") at " + new Date().toUTCString());
    let memberRole = guild.roles.find(role => role.name.toLowerCase() === "member");
    let welcomeMsg = [];
    welcomeMsg.push("` ◆ Welcome to Corecraft's Public Discord, Enjoy Your Stay! ◆ `");
    welcomeMsg.push("  ``` » We do have some rules which you can catch up on in #player_rules");
    welcomeMsg.push("      » #broadcasts is used for tourneys and normal events and manual proxy restart alerts and manual one server restarts and certain alerts about bugs and errors");
    welcomeMsg.push("      » We have a #spam  chat for your spamming needs and a #bot-usage  to use our bot commands!");
    welcomeMsg.push("      » In any of these new chats, Rules still apply!");
    welcomeMsg.push("      » We have 5 servers(1.8 Only)");
    welcomeMsg.push("                  » Redstone - Redstone PVP is where you are given a certain kit and you must kill people to gain gold to use in the currency converters to get more items and loot and work your way to the top!");
    welcomeMsg.push("                  » OP Factions - Contains OP Enchantments and stacked armour and pots to use in pvp at /warp pvp and warp fps, You can raid and sell and make huge amounts of money, If you have a bug pm staff!");
    welcomeMsg.push("                  » SE Factions - SE is a nerfed version of OP Factions and has many things to do like Socket Enchantments but not going to spoil it all, The rest is for you to find out!");
    welcomeMsg.push("                  » Server Name - Soon To Come!");
    welcomeMsg.push("                  » Server Name - Soon To Come!");
    welcomeMsg.push("     » Check #annoucements  for updates, They will be there time to time and #form-links contains certain forms if you have a suggestion or a problem ```");
    welcomeMsg.push("    `◆ Server Managers ◆`");
    welcomeMsg.push("    ```");
    welcomeMsg.push("      » Asruna");
    welcomeMsg.push("      » Ashrune");
    welcomeMsg.push("      » RIjkjeroen");
    welcomeMsg.push("      » PM one of the 3 with bugs, Welcome to Corecraft, Enjoy Your Stay! ```");
    welcomeMsg.push("     `◆ Anime Chat ◆`");
    welcomeMsg.push("      ```");
    welcomeMsg.push("       » Contact Rize in order to be added to this chat, and contact him to be removed if need be as well");
    welcomeMsg.push("     ```");
    member.sendMessage(welcomeMsg);
    member.addRole(memberRole);
  }
});

bot.on("guildMemberRemove", function(member) {
  let guild = member.guild;
  if (ConfigFile.backup_mode && (guild.name.startsWith("~Nyaa") || guild.id === '130616817625333761')) {
    guild.defaultChannel.sendMessage("(◕︵◕) " + member + " left the server. Bye~");
  }
  if (guild.name.startsWith("~Nyaa")) {
    let nyaaCh = guild.channels.find(channel => channel.name === "nyaa");
    if (nyaaCh !== null && nyaaCh !== undefined) {
      let msg = "Leave: ``" + member.user.username + "`` (" + member.id + ") at " + new Date().toUTCString();
      nyaaCh.sendMessage(msg);
      console.log(msg + " from " + guild.name);
    }
  }
});

bot.on("guildBanAdd", function(guild, user) {
  if (ConfigFile.backup_mode && (guild.name.startsWith("~Nyaa") || guild.id === '130616817625333761')) {
    guild.defaultChannel.sendMessage("(◕︵◕) Oh no! " + user + " just got banned!\nPlease try to avoid walking the same path as them :heart:");
  }
});

bot.on("guildBanRemove", function(guild, user) {
  if (ConfigFile.backup_mode && (guild.name.startsWith("~Nyaa") || guild.id === '130616817625333761')) {
    guild.defaultChannel.sendMessage("(▰˘◡˘▰) Yay! " + user + " just got unbanned!\nWelcome them back, and help them stay in line this time :heart:");
  }
});

bot.on("userUpdate", function(oldUser, newUser) {
  if (oldUser.username !== newUser.username) {
    let count = 0;
    let guilds = bot.guilds.array();
    for (let i_guild in guilds) {
      let guild = guilds[i_guild];
      if (guild.name.startsWith("~Nyaa")) {
        let gMember = guild.members.find(member => member.id === newUser.id);
        if (gMember !== null && gMember !== undefined) {
          let nyaaCh = guild.channels.find(channel => channel.name === "nyaa");
          if (nyaaCh !== null && nyaaCh !== undefined) {
            let msgArray = [];
            msgArray.push("Name Change - UserID: #" + newUser.id);
            msgArray.push(oldUser.username + " --> `" + newUser.username + "`");
            nyaaCh.sendMessage(msgArray.join("\n"));
            count++;
          }
        }
      }
      if (guild.id === coreCraftId) {
        let gMember = guild.members.find(member => member.id === newUser.id);
        if (gMember !== null && gMember !== undefined) {
          let logCh = guild.channels.find(channel => channel.id === "238111180562890752");
          let msgArray = [];
          msgArray.push("**Name Change** - UserID: #" + newUser.id);
          msgArray.push("`" + oldUser.username + "` --> `" + newUser.username + "`");
          logCh.sendMessage(msgArray.join("\n"));
        }
      }
    }
  }
});

bot.on("messageDelete", (message) => {
  let guild = message.guild;
  if (guild.id === coreCraftId) {
    let logCh = guild.channels.find(channel => channel.name === "log");
    let msgArray = [];
    msgArray.push(`**Message Delete:** \`${message.author.username}\` (${message.author.id}) in channel #${message.channel.name}`);
    msgArray.push(`\`${message.cleanContent}\``);
    logCh.sendMessage(msgArray.join("\n"));
  }
});

bot.on("message", function(message) {
  if (message.author.id === bot.user.id) {
    return;
  }

  if ((message.guild === null || message.guild === undefined) && message.content.substring(0, prefix.length) === prefix) {
    message.channel.sendMessage("I cannot parse commands in PMs. Try in a guild I'm in instead :heart:");
    return;
  }

  if (message.content.substring(0, 1) === "!") {
    console.log("Command executed by " + message.author.username + " in " + message.guild.name + " (#" + message.channel.name + "): " + message.content);
    let cmdText = message.content.split(" ")[0].substring(1).toLowerCase();
    let suffix = message.content.substring(cmdText.length + 2);
    let cmd = commands[cmdText];

    if (cmd !== undefined) {
      if (cmd.hasOwnProperty('alternateInvoke') && cmd.alternateInvoke) {
        if (checkPerms(cmd, message)) {
          cmd.process(bot, message, suffix);
        }
        else {
          message.channel.sendMessage("You have insufficient permissions to run this command!");
        }
      }
    }
  }

  if (message.content.includes("~") && message.content.toLowerCase().includes("server") && message.guild.name.startsWith("~Nyaa") && ConfigFile.tablepanic) {
    console.log("Checking for valid server mention from message by " + message.author.username + " in " + message.guild.name + " (#" + message.channel.name + "): " + message.content);
    let serverMention = message.content.substring(message.content.lastIndexOf("~", message.content.toLowerCase().indexOf("server")) + 1, message.content.toLowerCase().indexOf("server")).trim().toLowerCase();
    let country = countryServers[serverMention];
    if (country !== undefined) {
      if (Date.now() >= country.cooldown) {
        message.channel.sendMessage(country.name + " Server: " + country.invite);
        country.cooldown = Date.now() + 10000;
      }
      return;
    }
  }

  if (message.content.toLowerCase().startsWith("tableuserinfo") && message.guild.name.startsWith("~Nyaa") && ConfigFile.tablepanic) {
    let suffix = message.content.substring(14);
    let cmd = commands["whois"];
    message.channel.sendMessage(message.author + ", psst! Use `" + prefix + "whois` instead~ :heart:");

    cmd.process(bot, message, suffix);
  }

  if (message.content.substring(0, prefix.length) === prefix) {
    console.log("Command executed by " + message.author.username + " in " + message.guild.name + " (#" + message.channel.name + "): " + message.content);
    let cmdText = message.content.split(" ")[0].substring(prefix.length).toLowerCase();
    let suffix = message.content.substring(cmdText.length + prefix.length + 1);
    let cmd = commands[cmdText];

    if (cmd !== undefined) {
      if (checkPerms(cmd, message)) {
        cmd.process(bot, message, suffix);
      }
      else {
        message.channel.sendMessage("You have insufficient permissions to run this command!");
      }
    }
  }

  // chat trigger
  /*if (message.content.toLowerCase().includes('dabs')) {
    message.channel.sendMessage("<@" + message.author.id + ">, look at my da-- NO. :slight_frown:");
  }*/
});

var checkPerms = function(command, message) {
  var result = true;
  var member = message.member;
  var guild = member.guild;

  // Checks if the guild is part of the Nyaa network and (for role specifics) isn't Sarah's vanity server. Nyaa network has custom perms.
  if (command.hasOwnProperty('nyaaOnly')) {
    if (guild.id === '130616817625333761') {
      result = true;
    }
    else if (guild.name.startsWith('~Nyaa')) {
      result = true;
    }
    else {
      result = false;
    }
  }
  if (command.hasOwnProperty('corecraftEnable')) {
    if (guild.id === coreCraftId) result = true;
  }
  if (guild.name.startsWith('~Nyaa') && guild.id !== '203909599340920832') {
    if (command.hasOwnProperty('trialModOnly') && command.trialModOnly) {
      let trialMod = guild.roles.find(role => role.name.toLowerCase() === "trial moderator");
      if (member.highestRole.position < trialMod.position) {
        result = false;
      }
    }
    if (command.hasOwnProperty('modOnly') && command.modOnly) {
      let moderator = guild.roles.find(role => role.name.toLowerCase() === "moderator");
      if (member.highestRole.position < moderator.position) {
        result = false;
      }
    }
    if (command.hasOwnProperty('adminOnly') && command.adminOnly) {
      let admin = guild.roles.find(role => role.name.toLowerCase() === "admin");
      if (member.highestRole.position < admin.position) {
        result = false;
      }
    }
    if (command.hasOwnProperty('superAdminOnly') && command.superAdminOnly) {
      let superAdmin = guild.roles.find(role => role.name.toLowerCase() === "super admin");
      if (member.highestRole.position < superAdmin.position) {
        result = false;
      }
    }
    if (command.hasOwnProperty('teOnly') && command.teOnly) {
      let trustedEmployee = guild.roles.find(role => role.name.toLowerCase() === "trusted employee");
      if (member.highestRole.position < trustedEmployee.position) {
        result = false;
      }
    }
    else if (command.hasOwnProperty('upOnly') && command.upOnly) {
      let ultimatePower = guild.roles.find(role => role.name.toLowerCase() === "ultimate power");
      if (member.highestRole.position < ultimatePower.position) {
        result = false;
      }
    }
  }
  if (command.hasOwnProperty('requiredPerms') && !member.permissions.hasPermissions(command.requiredPerms)) result = false;
  // Bypasses the check if the one running the command is the guild owner or Visate. Still locks debug related stuff
  if (guild.ownerID === member.id) result = true;
  if (command.hasOwnProperty('ownerOnly') && command.ownerOnly && member.user.id !== guild.ownerID) result = false;
  if (command.hasOwnProperty('visateOnly') && command.visateOnly && member.user.id !== '97198953430257664') result = false;
  if (member.user.id === '97198953430257664') result = true;
  return result;
};

bot.login(token);
