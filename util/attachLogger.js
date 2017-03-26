const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment");

module.exports = client => {
  client.log = (...msg) => log(client, chalk.green.bold, "LOG", ...msg);
  client.error = (...msg) => log(client, chalk.bgRed.white.bold, "ERR", ...msg);
  client.warn = (...msg) => log(client, chalk.bgYellow.white.bold, "WRN", ...msg);
};

function log(client, style, type, ...msg) {
  if (client.config.logLocation) {
    let loc = path.join(__dirname, "../", client.config.logLocation, `${moment().format("YYYY-MM-DD")}.log`);
    fs.appendFileSync(loc, `[${type}] [${moment().format("HH:mm:ss")}] ${msg.join(" ")}`);
  }

  console.log(style(`[${type}] [${moment().format("MMM DD HH:mm:ss")}]`), ...msg);
}
