// Togglemode command
const fs = require("fs");
const config = require("../config.json");

exports.help = {
  name: "togglemode",
  usage: "<mode>",
  description: "Toggles the specified mode.",
  extendedhelp: `Toggles the specified mode. List modes with ${config.settings.prefix}togglemode modes.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["toggle"],
  permLevel: 6
};

exports.run = (bot, msg, suffix) => {
  suffix = suffix.toLowerCase();
  let modes = ["nyaabot"];
  if (suffix === "modes") return msg.channel.sendMessage(`**Available Modes:**\n${modes.join(", ")}`);
  if (!modes.includes(suffix)) return;
  else config.modes[suffix] = config.modes[suffix] ? false : true;

  fs.writeFileSync("../config.json", JSON.stringfy(config, null, 2));
  msg.channel.sendMessage(`Mode "${suffix}": ${config.modes[suffix]}`);
  bot.reloadConfig();
};
