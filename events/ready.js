module.exports = client => {
  client.log(`Logged in as ${client.user.username}!`);
  client.log(`Serving ${client.users.size} users in ${client.channels.size} channels in ${client.guilds.size} servers.`);
  client.log("--------------------------------");

  // Ops server notification
};
