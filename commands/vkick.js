// Vkick command
const stripIndents = require("common-tags").stripIndents;
const config = require("../config.json");
const createID = require("../scripts/createid.js");

exports.help = {
  name: "vkick",
  usage: "<user>",
  description: "Kicks a user from a voice channel",
  extendedhelp: "Creates a new voice channel, moves that user to that channel and then deletes the channel, effectively kicking the user from voice."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  alternateInvoke: true,
  aliases: ["voicekick"],
  permLevel: 4
};

exports.run = (bot, msg, suffix) => {
  let guild = msg.guild;
  let userQuery = suffix.toLowerCase();
  let member;

  if (userQuery.startsWith("<@!")) userQuery = userQuery.slice(3, -1);
  else if (userQuery.startsWith("<@")) userQuery = userQuery.slice(2, -1);

  if (!isNaN(userQuery)) {
    member = guild.members.find(m => m.id === userQuery && m.voiceChannel);
    if (member) processVkick(msg, member);
    else return msg.channel.sendMessage("No voice users were found with this user query, try something else~");
  }

  else {
    let usernames = guild.members.filter(m => m.voiceChannel && m.user.username.toLowerCase().includes(userQuery));
    let nicknames = guild.members.filter(m => m.voiceChannel && m.nickname && m.nickname.toLowerCase().includes(userQuery));
    let members = [];
    let ids = [];

    usernames.forEach(m => {
      members.push(m);
      ids.push(m.id);
    });

    nicknames.forEach(m => {
      if (ids.includes(m.id)) return;
      members.push(m);
    });

    if (members.length === 0) return msg.channel.sendMessage(`${msg.author}, no voice users were found with that user query, try something else~`).then(m => m.delete(5000));
    else if (members.length === 1) processVkick(msg, members[0]);
    else if (members.length > 1) {
      let idsInfo = stripIndents`
      Multiple users with that search were found, run the command again with \`${config.settings.prefix}vkick <id>\`
      ${members.map(m => `**${m.user.username}${m.nickname ? ` (${m.nickname})` : ""}:** ${m.id}`).join("\n")}
      `;

      return msg.channel.sendMessage(idsInfo);
    }
  }
};

function processVkick(msg, member) {
  msg.guild.createChannel(createID(), "voice").then(channel => {
    member.setVoiceChannel(channel).then(() => {
      channel.delete();
      msg.channel.sendMessage("^-^").then(m => m.delete(5000));
    });
  });
}
