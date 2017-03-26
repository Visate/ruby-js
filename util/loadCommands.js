const fs = require("fs");
const path = require("path");

module.exports = client => {
  const files = fs.readdirSync(path.resolve(__dirname, "../", "commands"));
  files.forEach(file => {
    if (file.endsWith(".js")) {
      let command = require(path.resolve(__dirname, "../", "commands", file));
      client.log(`Loading command: ${command.help.name}`);

      // Setting references to command collections
      client.commands.set(command.help.name, command);
      command.config.aliases.forEach(alias => {
        client.aliases.set(alias, command.help.name);
      });
    }
  });

  client.log("All commands loaded!");
};
