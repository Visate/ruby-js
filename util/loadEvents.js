const reqEvent = event => require(`../events/${event}`);

module.exports = client => {
  // Connection events
  client.on("ready", () => reqEvent("ready")(client));
  client.on("disconnect", event => reqEvent("disconnect")(client, event));
  client.on("reconnect", () => reqEvent("reconnect")(client));

  // Message handler
  client.on("message", reqEvent("message"));

  // Logging
  client.on("guildMemberAdd", reqEvent("guildMemberAdd"));
  client.on("guildMemberRemove", reqEvent("guildMemberRemove"));
  client.on("guildMemberUpdate", reqEvent("guildMemberUpdate"))
  client.on("userUpdate", reqEvent("userUpdate"));
  client.on("messageDelete", reqEvent("messageDelete"));
  client.on("messageDeleteBulk", reqEvent("messageDeleteBulk"));
  client.on("messageUpdate", reqEvent("messageUpdate"));
  client.on("guildBanAdd", reqEvent("guildBanAdd"));
  client.on("guildBanRemove", reqEvent("guildBanRemove"));

  // Music helper event
  client.on("voiceStateUpdate", reqEvent("voiceStateUpdate"));

  // Errors and warnings
  client.on("error", client.error);
  client.on("warn", client.warn);
};
