const moment = require("moment");

module.exports = member => {
  const client = member.client;

  const guild = member.guild;
  let nyaaCh = guild.channels.find(channel => channel.name === "nyaa");
  client.log(`${member.user.username}#${member.user.discriminator} (${member.id}) joined ${guild.name}`);

  if (nyaaCh) nyaaCh.sendMessage(client.util.commonTags.oneLine`
    **Join:** \`${client.util.cleanText(member.user.username)}#${member.user.discriminator}\`
    (${member.id}) on ${moment.utc().format("ddd, MMM DD YYY [at] HH:mm:ss [UTC]")}`);

  // TODO: Anti-raid auto-role disable
  let guestRole = guild.roles.find(role => role.name === "Guest");
  if (guestRole) member.addRole(guestRole);

  // TempHelp server
  if (guild.id === "130616817625333761") guild.defaultChannel.sendMessage(`Welcome to the server, ${member}!~ :heart:`);

  else {
    let rules = guild.channels.find(channel => channel.name === "read-the-rules");
    let help = guild.channels.find(channel =. channel.name === "help");

    let msg = client.util.commonTags.stripIndents`
    ${member} has just joined us! **Say hi ヾ(〃^∇^)ﾉ** :heart:
    Please ${rules ? rules : "read the rules"} and check out the ${help ? help : "help"} channel if you're new to Discord.
    If you have any questions feel free to ask the moderation team **(Do not ask NyaaKoneko, she has no time for you)**
    `;

    guild.defaultChannel.sendMessage(msg);

    let pm = client.util.commonTags.stripIndents`
    Hi ${bot.cleanText(member.user.username)}!
    Welcome to the ${guild.name} server - We're excited for you to join us!~
    We have a few rules here to ensure everyone has a great time, so please go over them in the ${rules ? rules : "read the rules"} channel :heart:
    If you have any questions, feel free to ask the moderation team. Also check out the ${help ? help : "help"} channel as it has a lot of useful information.
    Enjoy your stay :heart:
    `;

    member.sendMessage(pm);
  }
};
