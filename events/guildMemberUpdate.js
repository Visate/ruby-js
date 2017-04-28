module.exports = (oldMember, newMember) => {
  const client = newMember.client;
  const guild = newMember.guild;

  let nyaaCh = guild.channels.find(ch => ch.name === "nyaa");

  // Highest role change logging

  // Returning if the highest role of the guild member did not change
  if (newMember.highestRole.id === oldMember.highestRole.id) return;

  // Returning if the role change is to the Guest role or to the Temp Help role to reduce spam
  if (newMember.highestRole.name === "Guest" || newMember.highestRole.name === "Temp Help") return;
  client.log(`${member.user.username}#${member.user.discriminator} (${member.id}) highest role was changed from ${oldMember.highestRole} to ${newMember.highestRole}`);

  // Returning if no #nyaa channel
  if (!nyaaCh) return;

  nyaaCh.sendMessage(`**Role Change:** ${newMember.user.username}#${newMember.user.discriminator} (${newMember.id})\n${oldMember.highestRole.name} --> **${newMember.highestRole.name}**`);
};
