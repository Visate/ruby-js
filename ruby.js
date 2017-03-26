// Disable listener limit
require("events").EventEmitter.prototype._maxListeners = 0;

// Libraries and constants
const MusicHandler = require("./util/MusicHandler");
const StreamManager = require("./util/StreamManager");
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
require("./util/attachLogger")(client);

client.util = {
  // All util methods go here
  checkPerms: require("./util/checkPerms"),
  cleanText: require("./util/cleanText"),
  commonTags: require("common-tags"),
  createID: require("./util/createID"),
  database: require("./util/database"),
  linkServer: require("./util/linkServer"),
  musicHandler: new MusicHandler(client),
  reloadConfig: () => client.config = require("./config.json"),
  streamManager: new StreamManager(client),
  shuffle: require("./util/shuffle"),
  toHHMMSS: require("./util/toHHMMSS")
};

require("./util/loadAssets")(client);

client.login(client.config.token);

process.on("unhandledRejection", reason => client.error(reason));
