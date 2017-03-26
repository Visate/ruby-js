// pug command
const request = require("request");

exports.help = {
  name: "pug",
  description: "Sends a random pug.",
  extendedhelp: "Sends a random pug. Source: pugme.herokuapp.com"
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["pugs", "pugme"],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  request("http://pugme.herokuapp.com/bomb?count=1", (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let pug = JSON.parse(body);
      msg.reply(pug.pugs[0]);
    }

    else if (error) return msg.channel.sendMessage(`Error occured when fetching pug: ${error}`);
  });
};
