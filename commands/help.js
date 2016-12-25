// Help command
const stripIndents = require("common-tags").stripIndents;
const config = require("../config.json");
const helpOrder = require("./helporder.json");

exports.help = {
  name: "help",
  usage: "[command]",
  description: "Displays a help message.",
  extendedhelp: "Sends a command guide or how to use a specific command."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "?"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let perms = bot.checkPerms(msg);
  let msgArray = [];

  if (!suffix) {
    msgArray.push("= Your Guide to Using Ruby =\n");
    msgArray.push(`[Use ${config.settings.prefix}help <command> for details]\n`);
    let cmdArray = [];
    bot.commands.forEach(cmd => {
      if (perms < cmd.config.permLevel) return;
      if (!cmd.config.enabled) return;
      if (cmd.config.guildOnly && !msg.guild) return;
      let message = `${cmd.help.name}${cmd.help.usage ? ` ${cmd.help.usage}` : ""}:: ${cmd.help.description}`;
      if (helpOrder[cmd.help.name]) cmdArray[helpOrder[cmd.help.name]] = message;
      else cmdArray.push(message);
    });
    for (let i = 0; i < cmdArray.length; ) {
      if (cmdArray[i] === undefined) cmdArray.splice(i, 1);
      else i++;
    }
    msgArray.push(cmdArray.join("\n"));
    if (msg.guild) msg.channel.sendMessage(`:mailbox_with_mail: ${msg.author}, the commands have been direct messaged to you! :heart:`);
    msg.author.sendCode("asciidoc", msgArray);
  }

  else if (suffix && bot.commands.has(suffix)) {
    let cmd = bot.commands.get(suffix);
    if (perms < cmd.config.permLevel) return;
    if (!cmd.config.enabled) return;
    if (cmd.config.guildOnly && !msg.guild) return;
    let helpDetails = stripIndents`
    = ${cmd.help.name} =
    Usage:: ${cmd.help.name} ${cmd.help.usage ? cmd.help.usage : ""}

    ${cmd.help.extendedhelp}
    `;
    msg.channel.sendCode("asciidoc", helpDetails);
  }
};
