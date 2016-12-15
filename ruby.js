// Disable listener limit
require('events').EventEmitter.prototype._maxListeners = 0;
// Libraries and constants
const Discord = require("discord.js");
const bot = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true,
});
const config = require("./config.json");
const fs = require("fs");
const moment = require("moment");
const log = require("./scripts/log.js");
bot.musicHandler = require("./scripts/musichandler.js");
bot.database = require("./scripts/database.js");

// Lists
const nyaaServers = require("./lists/nyaa_servers.js");

// Command handler
// Command and aliases collections
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
// Read all the command files
bot.readCmds = () => {
  fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);
    log(`Loading a total of ${files.length} commands...`);
    files.forEach(f => {
      if (f.substring(f.length - 3) !== ".js") return;
      let command = require(`./commands/${f}`);
      log(`Loading command: ${command.help.name}`);
      // Setting references to command collections
      bot.commands.set(command.help.name, command);
      command.config.aliases.forEach(alias => {
        bot.aliases.set(alias, command.help.name);
      });
    });
  });
};

bot.readCmds();

bot.on("ready", () => {
  log(`Logged in as ${bot.user.username}!`);
  log(`Serving ${bot.users.size} users in ${bot.channels.size} channels of ${bot.guilds.size} servers.`);
  log(`-----------------`);

  bot.homeServer = bot.guilds.find(guild => guild.id === "235144885101920256");
  bot.homeServer.fetchMember(config.permissions.master[0]).then(master => {
    bot.homeServer.defaultChannel.sendMessage(`${master}\n${bot.user.username}: **READY**`);
  });
});

bot.on("message", msg => {
  // tracking prefix used
  let uPrefix;
  if (msg.content.startsWith(config.settings.prefix)) uPrefix = config.settings.prefix;
  else if (msg.content.startsWith("!")) uPrefix = "!";
  // checking for server mention
  else if (msg.content.includes("~") && msg.content.toLowerCase().includes("server")) {
    if (msg.channel.name === "nyaa-log" || msg.channel.name === "nyaa" || msg.channel.name === "ruby-log") return;
    let end = msg.content.toLowerCase().indexOf("server");
    let start = msg.content.lastIndexOf("~", end) + 1;
    let query = msg.content.toLowerCase().substring(start, end).trim();
    nyaaServers.linkServer(msg, query);
    return;
  }
  else return;

  // return conditions
  if (msg.author.id === bot.user.id) return;
  if (msg.author.bot) return;

  // command interpreting
  let command = msg.content.substring(uPrefix.length).split(" ")[0];
  let suffix = msg.content.substring(uPrefix.length + command.length + 1);
  let perms = bot.checkPerms(msg);
  let cmd;
  if (bot.commands.has(command)) cmd = bot.commands.get(command);
  else if (bot.aliases.has(command)) cmd = bot.commands.get(bot.aliases.get(command));

  if (cmd) {
    if (!cmd.config.enabled) return;
    if (cmd.config.guildOnly && !msg.guild) return;
    if (perms < cmd.config.permLevel) return;
    if (uPrefix === "!" && !cmd.config.alternateInvoke) return;
    cmd.run(bot, msg, suffix);
    log(`Command run by ${msg.author.username} in ${msg.guild.name} (#${msg.channel.name}): ${msg.content}`);
  }
});

// Logging
bot.on("guildMemberAdd", member => {
  let guild = member.guild;
  let nyaaCh = guild.channels.find(channel => channel.name === "nyaa");
  log(`${member.user.username} (${member.id}) joined ${guild.name}`);

  if (nyaaCh) nyaaCh.sendMessage(`Join: \`${bot.cleanText(member.user.username)}\` (${member.id}) on ${moment.utc().format("ddd, MMM DD YYYY at HH:mm:ss UTC")}`);

  if (config.modes.nyaabot) {

    if (guild.id === "130616817625333761") guild.defaultChannel.sendMessage(`Welcome to the server, ${member}!~ :heart:`);

    else {
      let guestRole = guild.roles.find(role => role.name === "Guest");
      let rules = guild.channels.find(channel => channel.name === "read-the-rules");
      let help = guild.channels.find(channel => channel.name === "help");

      let msgArray = [];
      msgArray.push(`${member} has just joined us! **Say hi ヾ(〃^∇^)ﾉ** :heart:`);
      msgArray.push(`Please ${rules} and check out the ${help} channel if you're new to Discord.`);
      msgArray.push(`If you have any questions feel free to ask the moderation team **(Do not ask NyaaKoneko, she has no time for you)**`);
      guild.defaultChannel.sendMessage(msgArray);

      let pmArray = [];
      pmArray.push(`Hi ${bot.cleanText(member.user.username)}!`);
      pmArray.push(`Welcome to our server - We're excited for you to join us!~`);
      pmArray.push(`We have a few rules here to ensure everyone has a great time, so please go over them in the #read-the-rules channel :heart:`);
      pmArray.push(`If you have any questions, feel free to ask the moderation team. Also check out the #help channel as it has a lot of useful information.`);
      pmArray.push(`Enjoy your stay :heart:`);
      member.sendMessage(pmArray);

      member.addRole(guestRole);
    }
  }
});

bot.on("guildMemberRemove", member => {
  let guild = member.guild;
  let nyaaCh = guild.channels.find(channel => channel.name === "nyaa");
  log(`${member.user.username} (${member.id}) left ${guild.name}`);

  if (nyaaCh) nyaaCh.sendMessage(`Leave: \`${bot.cleanText(member.user.username)}\` (${member.id}) on ${moment.utc().format("ddd, MMM DD YYYY at HH:mm:ss UTC")}`);

  if (config.modes.nyaabot) guild.defaultChannel.sendMessage(`(◕︵◕) ${member} left the server. Bye~`);
});

bot.on("userUpdate", (oldUser, newUser) => {
  if (oldUser.username !== newUser.username) {
    let count = 0;
    bot.guilds.forEach(guild => {
      let member = guild.members.find(member => member.id === newUser.id);
      if (member) {
        let nyaaCh = guild.channels.find(channel => channel.name === "nyaa");
        if (nyaaCh) {
          nyaaCh.sendMessage(`Name Change - UserID: #${newUser.id}\n${bot.cleanText(oldUser.username)} --> \`${bot.cleanText(newUser.username)}\``);
          count++;
        }
      }
    });

    log(`UserID #${newUser.id} changed name from ${oldUser.username} to ${newUser.username}. Logged in ${count} servers.`);
  }
});

bot.on("messageDelete", message => {
  let nyaaLogCh = message.guild.channels.find(channel => channel.name === "nyaa-log");

  let msgArray = [];
  msgArray.push(`Message Delete: ${message.author.username} (${message.author.id}) in channel #${message.channel.name}\n`);
  msgArray.push(message.content.replace(/@everyone/g, "__**@\u200beveryone**__").replace(/@here/g, "__**@\u200bhere**__"));
  nyaaLogCh.sendMessage(msgArray, {split: {prepend: "...", append: "..."}});
});

bot.on("messageDeleteBulk", messages => {
  let nyaaLogCh = messages.first().guild.channels.find(channel => channel.name === "nyaa-log");

  let msgArray = [];
  msgArray.push(`Message Bulk Delete:\n`);
  messages.forEach(message => {
    msgArray.push(`${message.author.username} (${message.author.id}) in #${message.channel.name}: ${message.content.replace(/@everyone/g, "__**@\u200beveryone**__").replace(/@here/g, "__**@\u200bhere**__")}`);
  });
  nyaaLogCh.sendMessage(msgArray, {split: {prepend: "...", append: "..."}});
});

bot.on("messageUpdate", (oldMessage, newMessage) => {
  let nyaaLogCh = newMessage.guild.channels.find(channel => channel.name === "nyaa-log");

  let msgArray = [];
  msgArray.push(`Message Edit: ${newMessage.author.username} (${newMessage.author.id}) in channel #${newMessage.channel.name}\n`);
  msgArray.push(`Before: ${oldMessage.content.replace(/@everyone/g, "__**@\u200beveryone**__").replace(/@here/g, "__**@\u200bhere**__")}`);
  msgArray.push(`After: ${newMessage.content.replace(/@everyone/g, "__**@\u200beveryone**__").replace(/@here/g, "__**@\u200bhere**__")}`);
  nyaaLogCh.sendMessage(msgArray, {split: {prepend: "...", append: "..."}});
});

bot.on("guildBanAdd", (guild, user) => {
  if (config.modes.nyaabot) guild.defaultChannel.sendMessage(`(◕︵◕) Oh no! ${user} just got banned!\nPlease try to avoid walking the same path as them :heart:`);
});

bot.on("guildBanRemove", (guild, user) => {
  if (config.modes.nyaabot) guild.defaultChannel.sendMessage(`(▰˘◡˘▰) Yay! ${user} just got unbanned!\nWelcome them back, and help them stay in line this time :heart:`);
});

// Forces an exit on disconnect
bot.on("disconnect", () => {
  log(`Disconnected from Discord!`);
  process.exit(0);
});

bot.on("error", console.error);
bot.on("warn", console.warn);

bot.login(config.bot.token);

// function to reload any commands
bot.reload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      bot.commands.delete(command);
      bot.aliases.forEach((cmd, alias) => {
        if (cmd === command) bot.aliases.delete(alias);
      });

      bot.commands.set(command, cmd);
      cmd.config.aliases.forEach(alias => {
        bot.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

bot.checkPerms = (msg) => {
  // reducing repetitiveness
  let permlvl = 0;
  let guild = msg.guild;
  if (guild) {
    let member = msg.member;
    let roles = guild.roles;
    let topRole = member.highestRole;
    // roles to compare with
    let trialMod = roles.find(role => role.name === "Trial Moderator");
    let mod = roles.find(role => role.name === "Moderator");
    let admin = roles.find(role => role.name === "Admin");
    let superAdmin = roles.find(role => role.name === "Super Admin");
    let trustedEmployee = roles.find(role => role.name === "Trusted Employee");
    let ultimatePower = roles.find(role => role.name === "Ultimate Power");
    let sarahMods = roles.find(role => role.name === "My Trusted Mods");    // Sarah's Vanity server mods

    // returns a permissions level that gets sent to the command handler
    // largely done by comparisons with other roles
    if (trialMod && trialMod.position <= topRole.position) permlvl = 1;
    if (mod && mod.position <= topRole.position) permlvl = 2;
    if (admin && admin.position <= topRole.position) permlvl = 3;
    if (superAdmin && superAdmin.position <= topRole.position) permlvl = 4;
    if (trustedEmployee && trustedEmployee.position <= topRole.position) permlvl = 5;
    if (sarahMods && sarahMods.position <= topRole.position) permlvl = 5;
    if (ultimatePower && ultimatePower.position <= topRole.position) permlvl = 6;
    if (member.id === guild.ownerID) permlvl = 7;
  }
  if (config.permissions.master.includes(msg.author.id)) permlvl = 8;
  return permlvl;
};

// function to fix text
bot.cleanText = (text) => {
  if (typeof text === "string") return text.replace(/`/g, "`\u200b").replace(/@/g, "@\u200b");
  else return text;
};
