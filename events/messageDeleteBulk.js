module.exports = msgs => {
  const client = msgs.first().client;
  if (!msgs.first().guild) return;

  let nyaaLogCh = msgs.first().guild.channels.find(channel => channel.name === "nyaa-log");

  let msgArray = [];
  msgArray.push(`\`[Message Bulk Delete] Messages Count: ${msgs.size()}\``);
  msgs.forEach(msg => {
    if (!msg.content && msg.attachments.size === 0) return;
    if (msg.system) return;

    msgArray.push(client.util.commonTags.oneLine`
      **${msg.author.username}#${msg.author.discriminator} (${msg.author.id}) in #${msg.channel.name}:
      ${msg.content.replace(/@everyone/g, "__**@\u200beveryone**__").replace(/@here/g, "__**@\u200bhere**__")}${msg.attachments.size !== 0 ? "\n" : ""}${msg.attachments.map(a => a.url).join("\n")}`);
  });

  if (nyaaLogCh) nyaaLogCh.sendMessage(msgArray, {split: {prepend: "...", append: "..."}});
};
