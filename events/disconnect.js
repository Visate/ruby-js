module.exports = (client, event) => {
  client.error("---- DISCONNECTED FROM DISCORD ----");
  client.error(event);
};
