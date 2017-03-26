module.exports = (guild, user) => {
  if (!guild.members.has(user.id)) return;
  guild.defaultChannel.sendMessage(`(◕︵◕) Oh no! ${user.username} (${user}) just got banned!\nPlease try to avoid walking the same path as them :heart:`);
};
