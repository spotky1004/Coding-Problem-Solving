const [, ...cases] =
// (require('fs').readFileSync(0)+"")
``
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));