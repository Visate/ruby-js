// Music command

const Collection = require("discord.js").Collection;
const fs = require("fs");
const path = require("path");

// Subcommand Init
const commands = new Collection();
const aliases = new Collection();

const files = fs.readdirSync(path.resolve("./music"));
for (const file in files) {
  if (file.endsWith(".js")) {
    let command = require(path.resolve("./", "music", file));
    client.log(`Loading music subcommand: ${command.help.name}`);

    // Setting references to subcommand collections
    commands.set(command.help.name, command);
    command.config.aliases.forEach(alias => {
      aliases.set(alias, command.help.name);
    });
  }
}

client.log("All music subcommands loaded!");

exports.help = {
  name: "music",
  usage: "<subcommand>",
  description: `Music bot commands, use #prefixmusic help`,
  extendedhelp: `Music bot commands, use #prefixmusic help to list all of the commands.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["m"],
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  // Subcommand handler
  let subCommand = suffix.split(" ")[0];
  let subSuffix = suffix.substring(subCommand.length + 1);
  let perms = client.util.checkPerms(msg);
  let subCmd = commands.has(subCommand) ? commands.get(subCommand) : commands.get(aliases.get(subCommand));

  if (subCmd) {
    //let player = bot.musicHandler.getPlayer(bot, msg.guild);
    if (!subCmd.config.enabled) return;
    if (subCmd.config.guildOnly && !msg.guild) return;
    if (perms < subCmd.config.permLevel) return;
    if (subCmd.help.name !== "join" && subCmd.help.name !== "help" && !player) return msg.channel.sendMessage(`I haven't joined a voice channel yet! Summon me to a voice channel with \`${client.config.prefix}music join\` first!`);
    if (subCmd.help.name !== "help" && player && (!msg.member.voiceChannel || msg.member.voiceChannel.id !== player.vChannel.id)) return msg.channel.sendMessage("You aren't in the active voice channel!");
    subCmd.run(client, msg, subSuffix);
  }
};

exports.getCommands = () => return subCommands;
