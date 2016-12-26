// Gmanagerole command

exports.help = {
  name: "gmanagerole",
  usage: "<add|remove> <userid or mention> <role>",
  description: "Assigns a role to a user across all servers.",
  extendedhelp: "Assigns a role to a user across all servers, as long as that role exists."
};

exports.config = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 6
};

exports.run = (bot, msg, suffix) => {
  if (!suffix) return msg.channel.sendMessage("Please specify an action, user, and role~");
  let [ action, userQuery, ...role ] = suffix.toLowerCase().split(" ");
  if (!action || !userQuery || !role) return msg.channel.sendMessage("Please specify an action, user, and role~");

  if (userQuery.startsWith("<@!")) userQuery = userQuery.slice(3, -1);
  else if (userQuery.startsWith("<@")) userQuery = userQuery.slice(2, -1);

  if (isNaN(userQuery)) return msg.channel.sendMessage("You did not specify a user correctly! Only provide a user mention or ID. Please try again~");

  processGrole(bot, msg, action, userQuery, role.join(" ")).then((action, memberName, roleName, count) => {
    if (action === "add") msg.channel.sendMessage(`${msg.author}, added ${roleName} to ${memberName} across ${count} servers.`);
    else if (action === "remove") msg.channel.sendMessage(`${msg.author}, removed ${roleName} from ${memberName} across ${count} servers.`);
  }).catch((action, memberName, roleName, count, countNoRole) => {
    if (count - countNoRole <= 0) msg.channel.sendMessage(`${msg.author}, unable to find user or role in the servers.`);
    else {
      if (action === "add") msg.channel.sendMessage(`${msg.author}, added ${roleName} to ${memberName} across ${count - countNoRole} servers.`);
      else if (action === "remove") msg.channel.sendMessage(`${msg.author}, removed ${roleName} from ${memberName} across ${count - countNoRole} servers.`);
    }
  });
};

function processGrole(bot, msg, action, userQuery, roleQuery) {
  let count = 0;
  let countNoRole = 0;
  let memberName;
  let roleName;

  return new Promise((resolve, reject) => {

    function checkPromise() {
      if (count === bot.guilds.size - 1 && countNoRole === 0) resolve(action, memberName, roleName, count);
      else if (count === bot.guilds.size - 1 && countNoRole > 0) reject(action, memberName, roleName, count, countNoRole);
    }

    bot.guilds.forEach(guild => {
      if (guild.id === "235144885101920256") return; //ignore testing server
      count++;

      let member = guild.members.get(userQuery);
      if (!member) {
        countNoRole++;
        checkPromise();
        return;
      }
      if (typeof memberName !== "string") memberName = member.user.username;

      let role = guild.roles.find(r => r.name.toLowerCase() === roleQuery);
      if (!role) {
        countNoRole++;
        checkPromise();
        return;
      }
      if (typeof roleName !== "string") roleName = role.name;

      if (action === "add") {
        member.addRole(role).then(() => {
          checkPromise();
        }).catch(() => {
          countNoRole++;
          checkPromise();
        });
      }

      else if (action === "remove") {
        member.removeRole(role).then(() => {
          checkPromise();
        }).catch(() => {
          countNoRole++;
          checkPromise();
        });
      }
    });
  });
}
