// Server invite lister
const moment = require("moment");
const Collection = require("discord.js").Collection;

var serverListing = require("./server_listings.json");
const servers = new Collection();
const aliases = new Collection();
const cooldowns = {};

// register servers
Object.keys(serverListing).forEach(category => {
  serverListing[category].forEach(server => {
    servers.set(server.name.toLowerCase(), server);
    server.aliases.forEach(alias => {
      aliases.set(alias, server.name.toLowerCase());
    });
  });
});

function onCooldown(channel, server) {
  let cooldown = cooldowns[channel.id][server.name];
  if (cooldown) return moment().isBefore(cooldown);
  return false;
}

function setCooldown(channel, server) {
  cooldowns[channel.id][server.name] = moment().add(10, "seconds");
}

exports.linkServer = (msg, query) => {
  let server = servers.get(query);
  if (!server) server = servers.get(aliases.get(query));
  if (server && !onCooldown(msg.channel, server)) {
    setCooldown(msg.channel, server);
    msg.channel.sendMessage(`${server.name} Server: ${server.invite}`);
  }
}
