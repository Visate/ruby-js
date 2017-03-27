const moment = require("moment");

module.exports = member => {
  const client = member.client;
  const guild = member.guild;

  let nyaaCh = guild.channels.find(channel => channel.name === "nyaa");
  client.log(`${member.user.username}#${member.user.discriminator} (${member.id}) left ${guild.name}`);

  if (nyaaCh) nyaaCh.sendMessage(`**Leave:** \`${client.util.cleanText(member.user.username)}#${member.user.discriminator}\` (${member.id}) on ${moment.utc().format("ddd, MMM DD YYYY [at] HH:mm:ss [UTC]")}`);

  guild.defaultChannel.sendMessage(`(◕︵◕) ${member.user.username} (${member}) left the server. Bye~`)
};
