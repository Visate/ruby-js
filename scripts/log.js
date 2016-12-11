const moment = require("moment");

module.exports = (msg) => {
  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  console.log(`[${now}] ${msg.replace(/\n/g, `\n[${now}]*`)}`);
};
