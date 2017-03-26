module.exports = (oldMember, newMember) => {
  // voice state helper for music module
  let player = newMember.client.util.musicHandler.getPlayer(newMember.guild);
  if (!player) return;
  if (newMember.voiceChannel && oldMember.voiceChannel && oldMember.voiceChannel.id === newMember.voiceChannel.id) return; // return early if no change in ch

  // inactivity timeout
  if (player.voice.members.size === 1) player.startTimeout();
  if (player.voice.members.size > 1 && player.timeout) player.cancelTimeout();
};
