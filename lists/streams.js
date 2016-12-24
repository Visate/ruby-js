const Collection = require("discord.js").Collection;
const request = require("request");
const WebSocket = require("ws");
const log = require("../scripts/log.js");
const list = new Collection();
const names = [];

list.set("r-a-d.io", {
  name: "r-a-d.io",
  queueUrl: "https://r-a-d.io",
  url: "https://stream.r-a-d.io/main.mp3",
  np: () => {
    request("https://r-a-d.io/api", (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let jsonObj = JSON.parse(body);
        return jsonObj["main"]["np"];
      }
    });
  }
});
names.push("r-a-d.io");

list.set("listen.moe", {
  name: "listen.moe",
  queueUrl: "https://listen.moe",
  url: "https://listen.moe/stream",
  np: () => {
    if (listenMoeJSON === {}) return;
    return `${listenMoeJSON.song_name} - ${listenMoeJSON.artist_name}`;
  }
});
names.push("listen.moe");
var listenMoeJSON;
var listenMoeWs;
function connectMoeWs() {
  if (listenMoeWs) listenMoeWs.removeAllListeners();
  try {
    listenMoeWs = new WebSocket("wss://listen.moe/api/v2/socket");
  } catch (e) {
    setTimeout(() => {
      connectMoeWs();
    }, 3000);
    log("Couldn't connect to listen.moe websocket, reconnecting...");
  }

  listenMoeWs.on("message", data => {
    try {
      if (data) listenMoeJSON = JSON.parse(data);
    } catch (error) {
      log(error);
    }
  });

  listenMoeWs.on("close", () => {
    setTimeout(() => {
      connectMoeWs();
    }, 3000);
    log("listen.moe websocket closed, reconnecting...");
  });

  listenMoeWs.on("error", console.error);
}
connectMoeWs();

exports.getStreams = () => {
  return list;
};

exports.hasStream = query => {
  return list.has(query.toLowerCase());
};

exports.getStream = query => {
  return list.get(query.toLowerCase());
};

exports.randomStream = () => {
  let iRandom = Math.floor(Math.random() * list.size);
  return list.get(names[iRandom]);
};
