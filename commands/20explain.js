// explain command
const request = require("request");

exports.help = {
  name: "explain",
  description: "Explains something by searching it on Urban Dictionary.",
  extendedhelp: "Explains something by searching it on Urban Dictionary."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["ud", "urbandictionary"],
  alternateInvoke: true,
  permLevel: 0
};

exports.run = (client, msg, suffix) => {
  request(`http://api.urbandictionary.com/v0/define?term=${suffix}`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let definitions = JSON.parse(body);
      if (definitions.result_type === "no_results") return msg.reply(`Sorry, I don't know about ${suffix} :heart:`);
      msg.reply(definitions.list[Math.floor(Math.random() * definitions.list.length)].definition);
    }

    else if (error) return msg.channel.sendMessage(`Error occured when looking up term: ${error}`);
  });
};
