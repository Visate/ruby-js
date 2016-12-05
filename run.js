var forever = require('forever-monitor');

var child = new (forever.Monitor)('ruby.js', {
  args: []
});

child.on('restart', () => {
  console.log("Restarting Ruby...");
});

child.on('exit:code', (code) => {
  console.log("Ruby's process exited with code " + code);
  if (code === 21) {
    console.log("Detected a shutdown code! Shutting down...");
    process.exit(0);
  }
})
child.on('exit', () => {
  console.log("Ruby's process has stopped!");
});

child.start();
