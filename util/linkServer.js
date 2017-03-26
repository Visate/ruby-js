// Server invite lister
const moment = require("moment");
const Collection = require("discord.js").Collection;

// Pre-database solution
const serverListing = require("../lists/server_listings.json");
const servers = new Collection();
const aliases = new Collection();
const cooldowns = {};

// register servers
Object.keys(serverListing).forEach(category => {
  serverListing[category].forEach(server => {
    servers.set(server.name.toLowerCase(), server);
    cooldowns[server.name] = {};
    server.aliases.forEach(alias => {
      aliases.set(alias, server.name.toLowerCase());
    });
  });
});

function onCooldown(channel, server) {
  if (cooldowns[server.name][channel.id]) return moment().isBefore(cooldowns[server.name][channel.id]);
  return false;
}

function setCooldown(channel, server) {
  cooldowns[server.name][channel.id] = moment().add(5, "seconds");
}

module.exports = (msg, query) => {
  let server = servers.get(aliases.get(query) || query);
  //if (!server) server = servers.get(aliases.get(query));
  if (server && !onCooldown(msg.channel, server)) {
    setCooldown(msg.channel, server);
    msg.channel.sendMessage(`${server.name} Server: ${server.invite}`);
  }
};
