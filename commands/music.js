// Music command
const Discord = require("discord.js");
const config = require("../config.json");
const log = require("../scripts/log.js");

// Command handler
const commands = new Discord.Collection();
const aliases = new Discord.Collection();
fs.readdir("./music/", (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} music commands...`);
  files.forEach(f => {
    if (f.substring(f.length - 3) !== ".js") return;
    let command = require(`./music/${f}`);
    log(`Loading music command: ${command.help.name}`);
    commands.set(command.help.name, command);
    command.config.aliases.forEach(alias => {
      aliases.set(alias, command.help.name);
    });
  });
});

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
