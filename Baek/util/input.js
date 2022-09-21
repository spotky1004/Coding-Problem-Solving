const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
``
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));
