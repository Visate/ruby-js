const moment = require("moment");
const chalk = require("chalk");

module.exports = (...args) => {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  console.log(chalk.blue.bold(`[${now}]`), chalk.bold(...args));
};
