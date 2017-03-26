module.exports = text => {
  if (typeof text === "string") return text.replace(/`/g, "`\u200b").replace(/@/g, "@\u200b");
  else return text;
};
