const config = require("../config.json");
const connections = {};

exports.createPlayer = (msg) => {
  connections[guild.id] = {
    vChannel: msg.member.voiceChannel,
    tChannel: msg.channel,

  };
};
