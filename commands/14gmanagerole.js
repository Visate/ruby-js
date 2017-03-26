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
  alternateInvoke: true,
  aliases: ["gmrole"],
  permLevel: 6
};

exports.run = (client, msg, suffix) => {
  if (!suffix) return msg.channel.sendMessage("Please specify an action, user, and role~");
  let [ action, userQuery, ...role ] = suffix.toLowerCase().split(" ");
  if (!action || !userQuery || !role) return msg.channel.sendMessage("Please specify an action, user, and role~");

  if (userQuery.startsWith("<@!")) userQuery = userQuery.slice(3, -1);
  else if (userQuery.startsWith("<@")) userQuery = userQuery.slice(2, -1);

  if (isNaN(userQuery)) return msg.channel.sendMessage("You did not specify a user correctly! Only provide a user mention or ID. Please try again~");

  processGrole(client, msg, action, userQuery, role.join(" ")).then(([ action, memberName, roleName, count ]) => {
    if (action === "add") msg.channel.sendMessage(`${msg.author}, added ${roleName} to ${memberName} in ${count} server${count === 1 ? "" : "s"}.`);
    else if (action === "remove") msg.channel.sendMessage(`${msg.author}, removed ${roleName} from ${memberName} in ${count} server${count === 1 ? "" : "s"}.`);
  }).catch(([ action, memberName, roleName, count, countNoRole ]) => {
    if (count - countNoRole <= 0) msg.channel.sendMessage(`${msg.author}, unable to find user or role in the servers.`);
    else {
      if (action === "add") msg.channel.sendMessage(`${msg.author}, added ${roleName} to ${memberName} in ${count - countNoRole} server${count - countNoRole === 1 ? "" : "s"}.`);
      else if (action === "remove") msg.channel.sendMessage(`${msg.author}, removed ${roleName} from ${memberName} in ${count - countNoRole} server${count - countNoRole === 1 ? "" : "s"}.`);
    }
  });
};

function processGrole(client, msg, action, userQuery, roleQuery) {
  return new Promise((resolve, reject) => {

    let count = 0;
    let countNoRole = 0;
    let memberName;
    let roleName;

    function checkPromise() {
      if (count === client.guilds.size && countNoRole === 0) resolve([action, memberName, roleName, count]);
      else if (count === client.guilds.size && countNoRole > 0) reject([action, memberName, roleName, count, countNoRole]);
    }

    client.guilds.forEach(guild => {
      count++;

      let member = guild.members.get(userQuery);
      if (!member) {
        countNoRole++;
        checkPromise();
        return;
      }
      if (!memberName) memberName = member.user.username;

      let role = guild.roles.find(r => r.name.toLowerCase() === roleQuery);
      if (!role) {
        countNoRole++;
        checkPromise();
        return;
      }
      if (!roleName) roleName = role.name;

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
