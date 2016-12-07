// Server invite lister
var moment = require("moment");

function findServer(query) {
  query = query.toLowerCase();
  let server = servers[query];
  if (server === null || server === undefined) server = aliases[query];

  if (server === null || server === undefined) return null;
  else return server;
}

function onCooldown(server, channel) {
  if (server.cooldowns[channel.id]) return moment().isBefore(server.cooldowns[channel.id]);
  return false;
}

function setCooldown(server, channel) {
  server.cooldowns[channel.id] = moment().add(10, 'seconds');
}

var servers = {
  // Event servers
  "nyaa will devour you": {
    name: "~Nyaa Will Devour You",
    invite: "https://discord.gg/ZM69sAP",
    cooldowns: {}
  },

  "osu! games and friends": {
    name: "osu! Games and Friends",
    invite: "https://discord.gg/H4VTYE8",
    cooldowns: {}
  },

  "the feels": {
    name: "The Feels",
    invite: "https://discord.gg/0dqEJX02AAe7qapg",
    cooldowns: {}
  },

  "butterfly garden": {
    name: "Butterfly Garden",
    invite: "https://discord.gg/0ahx8nCWNqhYfJul",
    cooldowns: {}
  },

  "romeo and julius": {
    name: "Romeo and Julius",
    invite: "https://discord.gg/0c434lX42DTqv8E4",
    cooldowns: {}
  },

  "pillow palace": {
    name: "Pillow Palace",
    invite: "https://discord.gg/ZNmZ2m6",
    cooldowns: {}
  },

  "my little pony": {
    name: "My Little Pony",
    invite: "https://discord.gg/0khzeMS3O8Z7dnFK",
    cooldowns: {}
  },

  "furry family": {
    name: "Furry Family",
    invite: "https://discord.gg/0aqNt49N9lIa9ynw",
    cooldowns: {}
  },

  "philosophy": {
    name: "Philosophy",
    invite: "https://discord.gg/0wHifh0wakepWoXp",
    cooldowns: {}
  },

  "science": {
    name: "Science",
    invite: "https://discord.gg/0wHicPsp61jVOA3C",
    cooldowns: {}
  },

  "the art gallery": {
    name: "The Art Gallery",
    invite: "https://discord.gg/0r1jg0mrwgCPYJdx",
    cooldowns: {}
  },

  "zodiac": {
    name: "Zodiac",
    invite: "https://discord.gg/etGvf94",
    cooldowns: {}
  },

  "disorders": {
    name: "Disorders",
    invite: "https://discord.gg/0l0B7AnCFEVd1mup",
    cooldowns: {}
  },

  "conspiracy theories": {
    name: "Conspiracy Theories",
    invite: "https://discord.gg/0wHiqWbvb2J09dHB",
    cooldowns: {}
  },

  "ero guro nansensu": {
    name: "Ero Guro Nansensu",
    invite: "https://discord.gg/0aiODeU1B05b6Z77",
    cooldowns: {}
  },

  "music": {
    name: "Music",
    invite: "https://discord.gg/0l2KPoaOveAuNk4X",
    cooldowns: {}
  },

  "halloweenies": {
    name: "Halloweenies",
    invite: "https://discord.gg/011fzQpr338xsw7l2",
    cooldowns: {}
  },

  // Australia servers
  "adelaide": {
    name: "Adelaide",
    invite: "https://discord.gg/0ZDr5SYHMyBDKbpe",
    cooldowns: {}
  },

  "brisbane": {
    name: "Brisbane",
    invite: "https://discord.gg/0ZD8LAL4hJvEYViS",
    cooldowns: {}
  },

  "cairns": {
    name: "Cairns",
    invite: "https://discord.gg/0eDrq3uuUSAeTK7s",
    cooldowns: {}
  },

  "canberra": {
    name: "Canberra",
    invite: "https://discord.gg/0ZfrQK7nk59RKjY9",
    cooldowns: {}
  },

  "darwin": {
    name: "Darwin",
    invite: "https://discord.gg/0j4lOe5NEJhmzZu8",
    cooldowns: {}
  },

  "melbourne": {
    name: "Melbourne",
    invite: "https://discord.gg/0ZD8H5WEzzfXs2tE",
    cooldowns: {}
  },

  "newcastle": {
    name: "Newcastle",
    invite: "https://discord.gg/0Zfqks79aldG43qh",
    cooldowns: {}
  },

  "perth": {
    name: "Perth",
    invite: "https://discord.gg/0ZRklMgwOCCXdxl8",
    cooldowns: {}
  },

  "port macquarie": {
    name: "Port Macquarie",
    invite: "https://discord.gg/0ZfqZJQHg86OFBNJ",
    cooldowns: {}
  },

  "sydney": {
    name: "Sydney",
    invite: "https://discord.gg/0ZBv6u3Iu4sR8Flo",
    cooldowns: {}
  },

  "tasmania": {
    name: "Tasmania",
    invite: "https://discord.gg/0ZU0Isybnb5N0sdU",
    cooldowns: {}
  },

  "townsville": {
    name: "Townsville",
    invite: "https://discord.gg/0exIe1ZoiENWAcRe",
    cooldowns: {}
  },

  // Country servers
  "argentina": {
    name: "Argentina",
    invite: "https://discord.gg/0ZfreIeaue4ZWllZ",
    cooldowns: {}
  },

  "austria": {
    name: "Austria",
    invite: "https://discord.gg/0eDTvUmdTTnO34nD",
    cooldowns: {}
  },

  "azerbaijan": {
    name: "Azerbaijan",
    invite: "https://discord.gg/0eDU8koqZBua6zRi",
    cooldowns: {}
  },

  "belarus": {
    name: "Belarus",
    invite: "https://discord.gg/0eDkryprgZRSodAN",
    cooldowns: {}
  },

  "belgium": {
    name: "Belgium",
    invite: "https://discord.gg/0eDl7zo54KXDezAw",
    cooldowns: {}
  },

  "bolivia": {
    name: "Bolivia",
    invite: "https://discord.gg/0rAx4zNHesc6cG3i",
    cooldowns: {}
  },

  "brazil": {
    name: "Brazil",
    invite: "https://discord.gg/0eDQ03VPUfJgh34L",
    cooldowns: {}
  },

  "brunei": {
    name: "Brunei",
    invite: "https://discord.gg/0eDqt0PylwnNXvc6",
    cooldowns: {}
  },

  "bulgaria": {
    name: "Bulgaria",
    invite: "https://discord.gg/0eDqbBgXMJtpzNqk",
    cooldowns: {}
  },

  "cambodia": {
    name: "Cambodia",
    invite: "https://discord.gg/GVDgJhC",
    cooldowns: {}
  },

  "canada": {
    name: "Canada",
    invite: "https://discord.gg/0ZH4lwpdXig65iRs",
    cooldowns: {}
  },

  "chile": {
    name: "Chile",
    invite: "https://discord.gg/0is99YaNk3iCFaOg",
    cooldowns: {}
  },

  "china": {
    name: "China",
    invite: "https://discord.gg/0eDQD5NHxQfpV1ry",
    cooldowns: {}
  },

  "colombia": {
    name: "Colombia",
    invite: "https://discord.gg/0isAFUvc69ZDi5zv",
    cooldowns: {}
  },

  "croatia": {
    name: "Croatia",
    invite: "https://discord.gg/0eDqMTWZZxGFsQkm",
    cooldowns: {}
  },

  "cuba": {
    name: "Cuba",
    invite: "https://discord.gg/jECXWqf",
    cooldowns: {}
  },

  "czech republic": {
    name: "Czech Republic",
    invite: "https://discord.gg/0eDr4N0H87qO52wO",
    cooldowns: {}
  },

  "denmark": {
    name: "Denmark",
    invite: "https://discord.gg/0eDQQxxTUZV2WRfA",
    cooldowns: {}
  },

  "egypt": {
    name: "Egypt",
    invite: "https://discord.gg/0eDrJgBoZcnhpuBO",
    cooldowns: {}
  },

  "estonia": {
    name: "Estonia",
    invite: "https://discord.gg/0isANMe727dt6Slb",
    cooldowns: {}
  },

  "finland": {
    name: "Finland",
    invite: "https://discord.gg/0eDrUcKfwx2b2mtR",
    cooldowns: {}
  },

  "france": {
    name: "France",
    invite: "https://discord.gg/0ZfrmrAbjCCMK0qU",
    cooldowns: {}
  },

  "germany": {
    name: "Germany",
    invite: "https://discord.gg/0ZftW6tl70oFnyfN",
    cooldowns: {}
  },

  "greece": {
    name: "Greece",
    invite: "https://discord.gg/0eDQvBoidXPxVYV0",
    cooldowns: {}
  },

  "guam": {
    name: "Guam",
    invite: "https://discord.gg/0eDrgRlX8JMsSMJe",
    cooldowns: {}
  },

  "hong kong": {
    name: "Hong Kong",
    invite: "https://discord.gg/0eDQjbu1y5hqL9MP",
    cooldowns: {}
  },

  "hungary": {
    name: "Hungary",
    invite: "https://discord.gg/0eDs2YLWyKrWsoiI",
    cooldowns: {}
  },

  "india": {
    name: "India",
    invite: "https://discord.gg/0eDRr62KdHi5Ucjb",
    cooldowns: {}
  },

  "indonesia": {
    name: "Indonesia",
    invite: "https://discord.gg/0eDRVSi64xalGkJk",
    cooldowns: {}
  },

  "ireland": {
    name: "Ireland",
    invite: "https://discord.gg/0is83mA2NRSjC4Ct",
    cooldowns: {}
  },

  "israel": {
    name: "Israel",
    invite: "https://discord.gg/0bLHcYbMGWFoTmD8",
    cooldowns: {}
  },

  "italy": {
    name: "Italy",
    invite: "https://discord.gg/0eDRHRnaAC9AXWkd",
    cooldowns: {}
  },

  "japan": {
    name: "Japan",
    invite: "https://discord.gg/0dHiutjeu3hAK9Lu",
    cooldowns: {}
  },

  "kazakhstan": {
    name: "Kazakhstan",
    invite: "https://discord.gg/0eDsEUcr2CiwWtU9",
    cooldowns: {}
  },

  "lithuania": {
    name: "Lithuania",
    invite: "https://discord.gg/0isA3w9Pg1PCBJzu",
    cooldowns: {}
  },

  "malaysia": {
    name: "Malaysia",
    invite: "https://discord.gg/0eDRiiX06ruklt61",
    cooldowns: {}
  },

  "mexico": {
    name: "Mexico",
    invite: "https://discord.gg/0rAvVeMaiL45bNax",
    cooldowns: {}
  },

  "netherlands": {
    name: "Netherlands",
    invite: "https://discord.gg/0ZDe2a2hrXXNiRuY",
    cooldowns: {}
  },

  "new zealand": {
    name: "New Zealand",
    invite: "https://discord.gg/0dIAGN8v3Qjm6VKB",
    cooldowns: {}
  },

  "norway": {
    name: "Norway",
    invite: "https://discord.gg/0is8REcaCGQlMMnv",
    cooldowns: {}
  },

  "paraguay": {
    name: "Paraguay",
    invite: "https://discord.gg/0rAwcX1PfGFk9zwh",
    cooldowns: {}
  },

  "philippines": {
    name: "Philippines",
    invite: "https://discord.gg/0is9YPbrO5jEZWl6",
    cooldowns: {}
  },

  "poland": {
    name: "Poland",
    invite: "https://discord.gg/0aEnYYM2Eiv1vWIj",
    cooldowns: {}
  },

  "portugal": {
    name: "Portugal",
    invite: "https://discord.gg/0is9szbE6cDkq8Yn",
    cooldowns: {}
  },

  "puerto rico": {
    name: "Puerto Rico",
    invite: "https://discord.gg/0rNoDqv6j3hT14UH",
    cooldowns: {}
  },

  "romania": {
    name: "Romania",
    invite: "https://discord.gg/0isAY5pA7nPL59JU",
    cooldowns: {}
  },

  "russia": {
    name: "Russia",
    invite: "https://discord.gg/0b1KVm67Vmzy0Giv",
    cooldowns: {}
  },

  "serbia": {
    name: "Serbia",
    invite: "https://discord.gg/0dI9syWXyoRJ12Jn",
    cooldowns: {}
  },

  "singapore": {
    name: "Singapore",
    invite: "https://discord.gg/0dI9JQdkEAtjsSjl",
    cooldowns: {}
  },

  "slovakia": {
    name: "Slovakia",
    invite: "https://discord.gg/0dI8sDtu83gHKelq",
    cooldowns: {}
  },

  "south africa": {
    name: "South Africa",
    invite: "https://discord.gg/0rAw9ICnyIepqwSl",
    cooldowns: {}
  },

  "south korea": {
    name: "South Korea",
    invite: "https://discord.gg/0beSC9ID5k0l1WPt",
    cooldowns: {}
  },

  "spain": {
    name: "Spain",
    invite: "https://discord.gg/0b1JzGvEl0klFn1j",
    cooldowns: {}
  },

  "sweden": {
    name: "Sweden",
    invite: "https://discord.gg/0Zfrwm7kiUThImbK",
    cooldowns: {}
  },

  "switzerland": {
    name: "Switzerland",
    invite: "https://discord.gg/0b1JlqmGy0dCMp4m",
    cooldowns: {}
  },

  "taiwan": {
    name: "Taiwan",
    invite: "https://discord.gg/0b1JYAEdSI0hmwFf",
    cooldowns: {}
  },

  "thailand": {
    name: "Thailand",
    invite: "https://discord.gg/0hTNRzyTmIeh3bPw",
    cooldowns: {}
  },

  "turkey": {
    name: "Turkey",
    invite: "https://discord.gg/0b1JJlYzeLWFJU4E",
    cooldowns: {}
  },

  "uae": {
    name: "UAE",
    invite: "https://discord.gg/0b1JDsT2krXUctNY",
    cooldowns: {}
  },

  "uk": {
    name: "UK",
    invite: "https://discord.gg/0ZRKsDlRUCrMljdi",
    cooldowns: {}
  },

  "ukraine": {
    name: "Ukraine",
    invite: "https://discord.gg/0b1J65hvvp5REfvZ",
    cooldowns: {}
  },

  "uruguay": {
    name: "Uruguay",
    invite: "https://discord.gg/0b1IY52JEs8JRZAs",
    cooldowns: {}
  },

  "usa": {
    name: "USA",
    invite: "https://discord.gg/tmCtmxZ",
    cooldowns: {}
  },

  "venezuela": {
    name: "Venezuela",
    invite: "https://discord.gg/0b1GeMhOWFw0WOvh",
    cooldowns: {}
  },

  "vietnam": {
    name: "Vietnam",
    invite: "https://discord.gg/0Zyk8AMOT1Pzyy7E",
    cooldowns: {}
  }
};

var aliases = {
  "vanity": servers["nyaa will devour you"],
  "osu": servers["osu! games and friends"],
  "main": servers["osu! games and friends"],
  "feels": servers["the feels"],
  "transgender": servers["butterfly garden"],
  "mlp": servers["my little pony"],
  "furry": servers["furry family"],
  "art gallery": servers["the art gallery"],
  "ero guro": servers["ero guro nansensu"],
  "guro": servers["ero guro nansensu"],
  "halloween": servers["halloweenies"],

  "ar": servers["argentina"],
  "at": servers["austria"],
  "az": servers["azerbaijan"],
  "by": servers["belarus"],
  "be": servers["belgium"],
  "bo": servers["bolivia"],
  "br": servers["brazil"],
  "bn": servers["brunei"],
  "bg": servers["bulgaria"],
  "kh": servers["cambodia"],
  "ca": servers["canada"],
  "cl": servers["chile"],
  "cn": servers["china"],
  "co": servers["colombia"],
  "hr": servers["croatia"],
  "cu": servers["cuba"],
  "cz": servers["czech republic"],
  "dk": servers["denmark"],
  "eg": servers["egypt"],
  "ee": servers["estonia"],
  "fi": servers["finland"],
  "fr": servers["france"],
  "de": servers["germany"],
  "gr": servers["greece"],
  "gu": servers["guam"],
  "hk": servers["hong kong"],
  "hu": servers["hungary"],
  "in": servers["india"],
  "id": servers["indonesia"],
  "ie": servers["ireland"],
  "il": servers["israel"],
  "it": servers["italy"],
  "jp": servers["japan"],
  "kz": servers["kazakhstan"],
  "lt": servers["lithuania"],
  "my": servers["malaysia"],
  "mx": servers["mexico"],
  "nl": servers["netherlands"],
  "nz": servers["new zealand"],
  "no": servers["norway"],
  "py": servers["paraguay"],
  "ph": servers["philippines"],
  "pl": servers["poland"],
  "pt": servers["portugal"],
  "pr": servers["puerto rico"],
  "ro": servers["romania"],
  "ru": servers["russia"],
  "rs": servers["serbia"],
  "sg": servers["singapore"],
  "sk": servers["slovakia"],
  "za": servers["south africa"],
  "kr": servers["south korea"],
  "es": servers["spain"],
  "se": servers["sweden"],
  "ch": servers["switzerland"],
  "tw": servers["taiwan"],
  "th": servers["thailand"],
  "tr": servers["turkey"],
  "ae": servers["uae"],
  "gb": servers["uk"],
  "ua": servers["ukraine"],
  "uy": servers["uruguay"],
  "us": servers["usa"],
  "ve": servers["venezuela"],
  "vn": servers["vietnam"]
};

exports.linkServer = (msg, query) => {
  let server = findServer(query);
  if (server !== null && server !== undefined && !onCooldown(server, msg.channel)) {
    setCooldown(server, msg.channel);
    msg.channel.sendMessage(`${server.name} Server: ${server.invite}`);
  }
}
