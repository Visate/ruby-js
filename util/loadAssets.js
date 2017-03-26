const Collection = require("discord.js").Collection;

module.exports = client => {
  client.commands = new Collection();
  client.aliases = new Collection();
  require("./loadCommands")(client);
  require("./loadEvents")(client);
};
