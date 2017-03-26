const unflips = require("../lists/unflips.json");
const tableflipRegex = /(?:ʕノ•ᴥ•ʔノ|\(\/¯◡ ‿ ◡\)\/¯ ~|\(._.\) ~|\(╯'□'\)╯|\(╯°□°）╯|\(ノ ゜Д゜\)ノ|\‎?\(ﾉಥ益ಥ）ﾉ\﻿?)\s?︵? ┻(━*)┻/;  //eslint-disable-line no-irregular-whitespace
const serverMentionRegex = /~(.*?)\s*?server/i;

const tableUnflipper = msg => {
  let flippedTable = msg.content.match(tableflipRegex);
  if (flippedTable) {
    let chance = Math.round(Math.random() * 100);
    if (chance < 10) {
      msg.reply(unflips.gif[Math.floor(Math.random() * unflips.gif.length)]);
    }
    else {
      msg.reply(unflips.text[Math.floor(Math.random() * unflips.text.length)].replace(/\$/g, flippedTable[1]));
    }
  }
};

const serverLinker = msg => {
  let serverMention = msg.content.match(serverMentionRegex);
  if (serverMention) msg.client.util.linkServer(msg, serverMention[1].toLowerCase());
};

module.exports = msg => {
  const client = msg.client;

  // Restrictions
  if (msg.author.id === client.user.id) return;
  if (msg.author.bot) return;

  // Tracking prefix used
  let prefix;
  if (msg.content.startsWith(client.config.prefix)) prefix = client.config.prefix;
  else if (msg.content.startsWith("!")) prefix = "!";
  else if (msg.content.startsWith(`${client.user} `)) prefix = `${client.user} `;

  // Message reactions
  else if (tableflipRegex.test(msg.content)) tableUnflipper(msg);
  else if (serverMentionRegex.test(msg.content)) serverLinker(msg);

  else return;

  // Prevent issues after message reactions
  if (!prefix) return;

  // Command interpreting
  let perms = client.util.checkPerms(msg);
  let command = msg.content.substring(prefix.length).split(" ")[0];
  let suffix = msg.content.substring(prefix.length + command.length + 1);
  let cmd = client.commands.has(command) ? client.commands.get(command) : client.commands.get(client.aliases.get(command));

  if (cmd) {
    if (!cmd.config.enabled) return;
    if (perms < cmd.config.permLevel) return;
    if (cmd.config.guildOnly && !msg.guild) return;
    // don't forget to check permissions
    if (prefix === "!" && !cmd.config.alternateInvoke) return;

    let location = msg.guild ? `${msg.guild.name} (#${msg.channel.name})` : "private messages";
    cmd.run(client, msg, suffix);
    client.log(`Command run by ${msg.author.username}#${msg.author.discriminator} in ${location}: ${msg.content}`);
  }
};
