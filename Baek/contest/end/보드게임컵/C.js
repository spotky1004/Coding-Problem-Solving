const isDev = process?.platform !== "linux";
const [[N], ...cards] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
HOURGLASS 3
CLOCK 12
HOURGLASS 12
WATCH 12
HOURGLASS 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

let curTime = -1;
let dt = 1;
let out = "";
for (const [s, x] of cards) {
  curTime = (curTime + dt + 12) % 12;
  if (s === "HOURGLASS") dt *= -1;
  let isSync = false;
  if (x-1 === curTime) {
    if (s === "HOURGLASS") {
      dt *= -1;
    } else {
      isSync = true;
    }
  }
  out += `${curTime+1} ${isSync ? "YES" : "NO"}\n`;
}

console.log(out.trim())
