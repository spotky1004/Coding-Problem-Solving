const isDev = process?.platform !== "linux";
const [] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
``
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
