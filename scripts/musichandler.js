const config = require("../config.json");
const connections = {};

function play(song) {
  let connInfo = connections[guild.id];
  if (connInfo === null || connInfo === undefined) return;
  else if (song === null || song === undefined) return connInfo.tChannel.sendMessage("The queue is empty! Better add some more song~");

  // connInfo.tChannel.sendMessage
}

exports.createPlayer = (msg) => {
  connections[guild.id] = {
    vChannel: msg.member.voiceChannel,
    tChannel: msg.channel,

  };
};
