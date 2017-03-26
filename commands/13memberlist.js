// Memberlist command
const moment = require("moment");

exports.help = {
  name: "memberlist",
  description: "Sends a file with all members in the server.",
  extendedhelp: "Generates and sends a file with all the members in the server."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["mlist", "memlist"],
  permLevel: 2
};

exports.run = (client, msg) => {
  let memberList = client.util.commonTags.stripIndents`
  Members on ${msg.guild.name} as of ${moment().format("ddd, MMM DD YYY [at] HH:mm:ss [UTC]")}
  --------------------------------------\n`;
  memberList += msg.guild.members.map(m => `${m.user.username}#${m.user.discriminator} (${m.id}) || Role: ${m.topRole.name}`).join("\n");

  msg.channel.sendFile(Buffer.from(memberList), "memberlist.txt");
};
