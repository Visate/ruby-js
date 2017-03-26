// Togglemode command
const fs = require("fs");
const path = require("path");

exports.help = {
  name: "togglemode",
  usage: "<mode>",
  description: "Toggles the specified mode.",
  extendedhelp: `Toggles the specified mode. List modes with #prefixtogglemode modes.`
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: ["toggle", "mode"],
  permLevel: 6
};

exports.run = (client, msg, suffix) => {
  let modes = Object.keys(client.config.modes);
  if (suffix.toLowerCase() === "modes") return msg.channel.sendMessage(`**Available Modes:**\n${modes.join(", ")}`);
  if (!modes.includes(suffix)) return;
  else config.modes[suffix] = client.config.modes[suffix] ? false : true;

  fs.writeFileSync(path.resolve("../", "config.json"), JSON.stringify(client.config, null, 2));
  msg.channel.sendMessage(`Mode "${suffix}": ${client.config.modes[suffix]}`);
  client.util.reloadConfig();
};
