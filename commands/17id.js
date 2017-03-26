// id command

exports.help = {
  name: "id",
  usage: "[user]",
  description: "Displays your or someone else's Discord ID.",
  extendedhelp: "Displays your or someone else's Discord ID. Only displays your ID in private messages."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  let user;

  if (!msg.guild || !suffix) user = msg.author;

  else if (msg.guild && suffix) {
    if (suffix.startsWith("<@!")) user = msg.guild.members.get(suffix.slice(3, -1)).user;
    else if (suffix.startsWith("<@")) user = msg.guild.members.get(suffix.slice(2, -1)).user;
    else {
      let query = suffix.toLowerCase();
      let members = msg.guild.members.filter(m => m.user.username.toLowerCase().includes(query) || (m.nickname && m.nickname.toLowerCase().includes(query)));

      if (members.size > 1 && members.size <= 10) {
        return msg.channel.sendMessage(client.util.commonTags.stripIndents`
          Multiple users were found with that search.
          ${members.map(m => `**${m.user.username}#${m.user.discriminator}${m.nickname ? ` (${m.nickname})` : ""}:** ${m.id}`).join("\n")}
        `);
      }
      else if (members.size > 10) return msg.channel.sendMessage("Too many users were found with that search, please narrow your search!~");
      else if (members.size === 1) user = members.first().user;
    }
  }

  if (!user) return msg.channel.sendMessage("No users were found with that search!");

  msg.channel.sendMessage(`**${user.username}#${user.discriminator}**'s ID is ${user.id}`);
};
