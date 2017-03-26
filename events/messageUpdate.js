module.exports = (oldMsg, newMsg) => {
  if (!newMsg.guild) return;
  if (oldMsg.content === newMsg.content) return;

  let nyaaLogCh = newMsg.guild.channels.find(ch => ch.name === "nyaa-log");

  let msg = newMsg.client.util.commonTags.stripIndents`
  \`[Message Edit] ${newMsg.author.username}#${newMsg.author.discriminator} (${newMsg.author.id}) in #${newMsg.channel.name}\`
  **Before:** ${oldMsg.content.replace(/@everyone/g, "__**@\u200beveryone**__").replace(/@here/g, "__**@\u200bhere**__")}
  **After:** ${newMsg.content.replace(/@everyone/g, "__**@\u200beveryone**__").replace(/@here/g, "__**@\u200bhere**__")}
  `;

  if (nyaaLogCh) nyaaLogCh.sendMessage(msg, {split: {prepend: "...", append: "..."}});
};
