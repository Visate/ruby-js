// Help command

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

exports.run = (client, msg, suffix) => {
  let perms = client.util.checkPerms(msg);
  let msgArray = [];

  if (!suffix) {
    msgArray.push("= Your Guide to Using ${client.user.username}=\n");
    msgArray.push(`[Use ${client.config.prefix}help <command> for details]\n`);
    client.commands.forEach(cmd => {
      if (perms < cmd.config.permLevel) return;
      if (!cmd.config.enabled) return;
      if (cmd.config.guildOnly && !msg.guild) return;
      let message = `${cmd.help.name}${cmd.help.usage ? ` ${cmd.help.usage}` : ""}:: ${cmd.help.description.replace(/#prefix/g, client.config.prefix)}`;
      msgArray.push(message);
    });

    if (msg.guild) msg.react(":mailbox_with_mail:").then(() => setTimeout(() => msg.clearReactions(), 5000));
    msg.author.sendCode("asciidoc", msgArray);
  }

  else if (suffix && (client.commands.has(suffix) || client.commands.has(client.aliases.get(suffix)))) {
    let cmd = client.commands.get(suffix) || client.commands.get(client.aliases.get(suffix));
    if (perms < cmd.config.permLevel) return;
    if (!cmd.config.enabled) return;
    if (cmd.config.guildOnly && !msg.guild) return;
    let helpDetails = client.util.commonTags.stripIndents`
    = ${cmd.help.name} =
    Usage:: ${cmd.help.name} ${cmd.help.usage ? cmd.help.usage : ""}

    ${cmd.help.extendedhelp.replace(/#prefix/g, client.config.prefix)}
    `;
    msg.channel.sendCode("asciidoc", helpDetails);
  }
};
