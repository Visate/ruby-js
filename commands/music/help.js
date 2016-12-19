// Help command
const config = require("../../config.json");

exports.help = {
  name: "help",
  usage: "[command]",
  description: "Displays a help message.",
  extendedhelp: "Sends a music command guide or how to use a specific command."
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
  let commands = bot.commands.get("music").getCommands();

  if (!suffix) {
    msgArray.push("= Music Commands =\n");
    msgArray.push(`[Use ${config.settings.prefix}music help <command> for details]\n`);
    commands.forEach(cmd => {
      if (perms < cmd.config.permLevel) return;
      if (!cmd.config.enabled) return;
      if (cmd.config.guildOnly && !msg.guild) return;
      let message = `${cmd.help.name}`;
      if (cmd.help.usage) message += ` ${cmd.help.usage}`;
      message += `:: ${cmd.help.description}`;
      msgArray.push(message);
    });
    if (msg.guild) msg.channel.sendMessage(`:mailbox_with_mail: ${msg.author}, the commands have been direct messaged to you! :heart:`);
    msg.author.sendCode("asciidoc", msgArray);
  }

  else if (suffix && commands.has(suffix)) {
    let cmd = commands.get(suffix);
    if (perms < cmd.config.permLevel) return;
    if (!cmd.config.enabled) return;
    if (cmd.config.guildOnly && !msg.guild) return;
    msgArray.push(`= ${cmd.help.name} =`);
    if (cmd.help.usage) msgArray.push(`Usage:: ${cmd.help.name} ${cmd.help.usage}\n`);
    else msgArray.push(`Usage:: ${cmd.help.name}\n`);
    msgArray.push(`${cmd.help.extendedhelp}`);
    msg.channel.sendCode("asciidoc", msgArray);
  }
};
