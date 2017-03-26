// cat command
const request = require("request");
const config = require("../config.json");

exports.help = {
  name: "cat",
  description: "Sends a random cat picture.",
  extendedhelp: "Sends a random cat picture. Source: thecatapi.com"
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["kitty"],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  request(`http://thecatapi.com/api/images/get?api_key=${client.config.apiKeys.theCatApi}&format=xml`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let url = body.match(/<url>.*<\/url>/);
      if (url[0]) msg.reply(url[0].replace(/<url>(.*)<\/url>/, "$1"));
    }

    else if (error) return msg.channel.sendMessage(`Error occured when finding cat: ${error}`);
  });
};
