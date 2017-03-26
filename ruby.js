// Disable listener limit
require("events").EventEmitter.prototype._maxListeners = 0;

// Libraries and constants
const Discord = require("discord.js");
const client = new Discord.Client({
  autoReconnect: true,
  disableEveryone: true,
  fetchAllMembers: true,
  disabledEvents: [
    "TYPING_START",
    "RELATIONSHIP_ADD",
    "RELATIONSHIP_REMOVE"
  ]
});

client.config = require("./config.json");

client.util = {
  // All util methods go here
  checkPerms: require("./util/checkPerms"),
  cleanText: require("./util/cleanText"),
  commonTags: require("common-tags"),
  createID: require("./util/createID"),
  database: require("./util/database"),
  linkServer: require("./util/linkServer"),
  musicHandler: require("./util/MusicHandler")(client),
  reloadConfig: () => client.config = require("./config.json"),
  streamManager: require("./util/StreamManager")(client),
  shuffle: require("./util/shuffle"),
  toHHMMSS: require("./util/toHHMMSS")
};

require("./util/attachLogger")(client);
require("./util/loadAssets")(client);

client.login(client.config.token);

process.on("unhandledRejection", reason => client.error(reason));
