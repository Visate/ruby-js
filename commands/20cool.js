// cool command
const request = require("request");

exports.help = {
  name: "cool",
  description: "Sends a random cool guy phrase.",
  extendedhelp: "Sends a random cool guy phrase. Source: icndb.com"
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  request(`http://api.icndb.com/jokes/random?firstName=${msg.author.username}&lastName=${msg.author.username}&escape=javascript`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let joke = JSON.parse(body);
      let value = joke.value.joke;
      let duplicateName = new RegExp(`${msg.author.username}\\s${msg.author.username}`, "g");
      value = value.replace(duplicateName, msg.author.username);
      msg.reply(value);
    }

    else if (error) return msg.channel.sendMessage(`Error occured when fetching phrase: ${error}`);
  });
};
