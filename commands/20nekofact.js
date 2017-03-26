// nekofact command
const request = require("request");

exports.help = {
  name: "nekofact",
  description: "Sends a random nekofact.",
  extendedhelp: "Sends a random nekofact. Source: catfacts-api.appspot.com"
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["catfact", "nekofacts", "catfacts"],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  request("http://catfacts-api.appspot.com/api/facts?number=1", (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let fact = JSON.parse(body);
      msg.reply(fact["facts"][0]);
    }

    else if (error) return msg.channel.sendMessage(`Error occured when loading nekofact: ${error}`);
  });
};
