const input = require("fs").readFileSync(
  require("path").join(__dirname, "1.txt"),
  "utf8"
)
  .split(`\r\n\r\n`).map(v => v.split("\n").map(Number));

console.log(Math.max(...input.map(v => v.reduce((acc, w) => acc + w, 0))));