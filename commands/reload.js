// Reload command
exports.help = {
  name: "reload",
  usage: "<commandname>",
  description: "Reloads the command file.",
  extendedhelp: "Reloads the command file if it's been updated or modified."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 8
};

exports.run = (bot, msg, suffix) => {
  let command;
  if (bot.commands.has(suffix)) {
    command = suffix;
  } else if (bot.aliases.has(suffix)) {
    command = bot.aliases.get(suffix);
  }
  if (!command) {
    return msg.channel.sendMessage(`I cannot find the command: ${suffix}`);
  } else {
    msg.channel.sendMessage(`Reloading: ${command}`)
    .then(m => {
      bot.reload(command)
      .then(() => {
        m.edit(`Successfully reloaded: ${command}`);
      })
      .catch(e => {
        m.edit(`Command reload failed: ${command}\n\`\`\`${e.stack}\`\`\``);
      });
    });
  }
};
