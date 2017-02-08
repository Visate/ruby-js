const forever = require("forever-monitor");
const log = require("./scripts/log.js");

var child = new (forever.Monitor)("ruby.js", {
  args: []
});

child.on("restart", () => {
  log("Restarting Ruby...");
});

child.on("exit:code", (code) => {
  log(`Ruby's process exited with code ${code}`);
  if (code === 21) {
    log("Detected a shutdown code! Shutting down...");
    process.exit(0);
  }
});

child.on("exit", () => {
  log("Ruby's process has stopped!");
});

child.start();
