module.exports = msg => {
  const client = msg.client;

  if (!msg.guild) return;
  if (!msg.content && msg.attachments.size === 0) return;
  if (msg.system) return;

  let nyaaLogCh = msg.guild.channels.find(channel => channel.name === "nyaa-log");

  if (nyaaLogCh) nyaaLogCh.sendMessage(client.util.commonTags.stripIndents`
    \`[Message Delete] ${client.util.cleanText(msg.author.username)}#${msg.author.discriminator} (${msg.author.id}) in #${msg.channel.name}\`
    ${msg.content.replace(/@everyone/g, "__**@\u200beveryone**__").replace(/@here/g, "__**@\u200bhere**__")}${msg.content ? "\n" : ""}${msg.attachments.map(a => a.url).join("\n")}
    `, {split: {prepend: "...", append: "..."}});
};
