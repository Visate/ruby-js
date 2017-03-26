// temporary role based solution until database is implemented

module.exports = msg => {
  const client = msg.client;

  // reducing repetitiveness
  let permlvl = 0;
  let guild = msg.guild;
  if (guild) {
    let member = msg.member;
    let roles = guild.roles;
    let topRole = member.highestRole;
    // roles to compare with
    let trialMod = roles.find(role => role.name === "Trial Moderator");
    let mod = roles.find(role => role.name === "Moderator");
    let admin = roles.find(role => role.name === "Admin");
    let superAdmin = roles.find(role => role.name === "Super Admin");
    let trustedEmployee = roles.find(role => role.name === "Trusted Employee");
    let ultimatePower = roles.find(role => role.name === "Ultimate Power");

    // returns a permissions level that gets sent to the command handler
    // largely done by comparisons with other roles
    if (trialMod && trialMod.position <= topRole.position) permlvl = 1;
    if (mod && mod.position <= topRole.position) permlvl = 2;
    if (admin && admin.position <= topRole.position) permlvl = 3;
    if (superAdmin && superAdmin.position <= topRole.position) permlvl = 4;
    if (trustedEmployee && trustedEmployee.position <= topRole.position) permlvl = 5;
    if (ultimatePower && ultimatePower.position <= topRole.position) permlvl = 6;
    if (member.id === guild.ownerID) permlvl = 7;
  }
  if (config.permissions.master.includes(msg.author.id)) permlvl = 8;
  return permlvl;
};
