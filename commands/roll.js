// Roll command
const request = require("request");
const mathjs = require("mathjs");

exports.help = {
  name: "roll",
  usage: "[(number of dice)d(number of sides) || number || min-max]",
  description: "Rolls a dice, or picks a random number within a range.",
  extendedhelp: "Either rolls a dice with a dice input (ex. 2d6), pick a number from 0 to your number, or pick a number from your minimum to maximum range. Otherwise, rolls a six-sided dice."
};

exports.config = {
  enabled: true,
  guildOnly: false,
  aliases: ["dice", "random"],
  permLevel: 0
};

exports.run = (bot, msg, suffix) => {
  let rollQuery = suffix.toLowerCase();
  if (rollQuery) {
    if (rollQuery.includes("d")) diceRoll(msg, rollQuery);
    else if (rollQuery.includes("-")) {
      let min = parseInt(rollQuery.split("-")[0], 10);
      let max = parseInt(rollQuery.split("-")[1], 10);
      msg.channel.sendMessage(`Rolled **${Math.round(mathjs.random(min, max))}** with ${rollQuery}`);
    }
    else if (!isNaN(rollQuery)) msg.channel.sendMessage(`Rolled **${Math.round(mathjs.random(parseInt(rollQuery, 10)))}** with ${rollQuery}`);
  }

  else diceRoll(msg, "d6");
};

function diceRoll(msg, dice) {
  request(`https://rolz.org/api/?${dice}.json`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let roll = JSON.parse(body);
      msg.channel.sendMessage(`Rolled **${roll.result}** with ${dice}`);
    }
  });
}
