const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true, fetchAllMembers: true});

var Config = require('./config.json');
var token = Config.discord_token;

bot.login(token);