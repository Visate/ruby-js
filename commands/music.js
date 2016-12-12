// Music command
const Discord = require("discord.js");
const config = require("../config.json");

exports.help = {
  name: "music",
  usage: "<subcommand>",
  description: `Music bot commands, ${config.settings.prefix}music help`,
  extendedhelp: "Commands to use the music bot! Use ${config.settings.prefix}music help to list all the commands."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["m"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {

};
