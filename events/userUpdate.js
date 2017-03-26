module.exports = (oldUser, newUser) => {
  const client = newUser.client;

  if (oldUser.username !== newUser.username) {
    let count = 0;
    client.guilds.forEach(guild => {
      if (guild.members.has(newUser.id)) {
        let nyaaCh = guild.channels.find(channel => channel.name === "nyaa");
        if (nyaaCh) {
          nyaaCh.sendMessage(client.util.commonTags.oneLine`
            **Name Change** - UserID: #${newUser.id}
            \n${client.util.cleanText(oldUser.username)} -->
            \`${client.util.cleanText(newUser.username)}\`
            \n${oldUser.discriminator !== newUser.discriminator ? `New Discriminator: ${newUser.discriminator}` : ""}`);
          count++;
        }
      }
    });

    client.log(`User ID #${newUser.id} changed name from ${oldUser.username} to ${newUser.username}. Logged in ${count} servers.`);
  }
};
