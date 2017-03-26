const Collection = require("discord.js").Collection;
const request = require("request");
const WebSocket = require("ws");

class StreamManager {

  constructor(client) {
    this.client = client;
    this.streams = new Collection();

    // r-a-d.io
    streams.set("r-a-d.io", new RADio(client));

    // listen.moe
    streams.set("listen.moe", new ListenMoe(client));
  }

  getStreams() {
    return this.streams;
  }

  hasStream(query) {
    return this.streams.has(query.toLowerCase());
  }

  getStream(query) {
    return this.streams.get(query.toLowerCase());
  }

  randomStream() {
    let list = Array.from(this.streams.keys());
    let i = Math.floor(Math.random() * list.size);
    return this.streams.get(list[i]);
  }
}

class Stream {

  constructor(client, name, queueURL, streamURL) {
    this.client = client;
    this.name = name;
    this.queueURL = queueURL;
    this.streamURL = streamURL;
  }

  np() {
    return name;
  }
}

class RADio extends Stream {

  constructor(client) {
    super(client, "r-a-d.io", "https://r-a-d.io", "https://stream.r-a-d.io/main.mp3");

    this.jsonInfo;
    this.timeout;

    this.update();
  }

  np() {
    this.update();
    if (!this.jsonInfo || this.jsonInfo === {}) return "Unknown";
    return this.jsonInfo.main.np;
  }

  update() {
    request("https://r-a-d.io/api", (err, res, body) => {
      if (!err && res.statusCode === 200) {
        this.jsonInfo = JSON.parse(body);
        let timeRemaining = this.jsonInfo.end_time - this.jsonInfo.current;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => updateRadio(), timeRemaining * 1000);
      }
    });
  }
}

class ListenMoe extends Stream {

  constructor(client) {
    super(client, "listen.moe", "https://listen.moe", "https://listen.moe/stream");

    this.jsonInfo;
    this.ws;

    this.connectWs();
  }

  np() {
    if (!this.jsonInfo || this.jsonInfo === {}) return "Unknown";
    return `${this.jsonInfo.song_name} - ${this.jsonInfo.artist_name}`;
  }

  connectWs() {
    if (this.ws) this.ws.removeAllListeners();
    try {
      this.ws = new WebSocket("wss://listen.moe/api/v2/socket");
    } catch (e) {
      setTimeout(() => {
        this.connectWs();
      }, 3000);
    }

    this.ws.on("message", data => {
      try {
        if (data) this.jsonInfo = JSON.parse(data);
      } catch (error) {
        this.client.error(error);
      }
    });

    this.ws.on("close", () => {
      setTimeout(() => {
        this.connectWs();
      }, 3000);
    });

    this.ws.on("error", client.error);
  }
}

module.exports = StreamManager;
