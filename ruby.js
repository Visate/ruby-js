const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true, fetchAllMembers: true});
const config = require("./config.json");
const fs = require("fs");
const moment = require("moment");

const log = (msg) => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${msg}`);
};

// Command handler
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
// Read all the command files
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands...`);
  files.forEach(f => {
    let command = require(`./commands/${f}`);
    log(`Loading command: ${command.help.name}`);
    // Setting references to command collections
    bot.commands.set(command.help.name, command);
    command.config.aliases.forEach(alias => {
      bot.aliases.set(alias, command.help.name);
    });
  });
});

bot.on("ready", () => {
  log(`Logged in as ${bot.user.username}!`);
  log(`Serving ${bot.users.size} users in ${bot.channels.size} channels of ${bot.guilds.size} servers.`);
});

bot.on("message", msg => {
  // tracking prefix used for later
  let uPrefix;
  if (msg.content.startsWith(config.prefix)) uPrefix = config.prefix;
  else if (msg.content.startsWith("!")) uPrefix = "!";
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
    if (perms < cmd.config.permLevel) return;
    if ((!cmd.config.hasOwnProperty("alternateInvoke") || (cmd.config.hasOwnProperty("alternateInvoke") && !cmd.config.alternateInvoke)) && uPrefix === "!") return;
    cmd.run(bot, msg, suffix);
  }
});

bot.on("error", console.error);
bot.on("warn", console.warn);

bot.login(config.bot.token);

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
  let guild = msg.guild;
  let member = msg.member;
  let roles = guild.roles;
  let topRole = member.highestRole;

  let permlvl = 0;
  // roles to compare with
  let trialMod = roles.find(role => role.name === "Trial Moderator");
  let mod = roles.find(role => role.name === "Moderator");
  let admin = roles.find(role => role.name === "Admin");
  let superAdmin = roles.find(role => role.name === "Super Admin");
  let trustedEmployee = roles.find(role => role.name === "Trusted Employee");
  let ultimatePower = roles.find(role => role.name === "Ultimate Power");

  // returns a permissions level that gets sent to the command handler
  // largely done by comparisons with other roles
  if (trialMod.position <= topRole.position) permlvl = 1;
  if (mod.position <= topRole.position) permlvl = 2;
  if (admin.position <= topRole.position) permlvl = 3;
  if (superAdmin.position <= topRole.position) permlvl = 4;
  if (trustedEmployee.position <= topRole.position) permlvl = 5;
  if (ultimatePower.position <= topRole.position) permlvl = 6;
  if (member.id === guild.ownerID) permlvl = 7;
  if (config.permissions.master.contains(member.id)) permlvl = 8;
  return permlvl;
};
