const isDev = process.platform !== "linux";
const start = Number((
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10
`
).trim());

/** @type {[cost: number, prev: number][]} */
const dp = Array(1e6 + 1);
dp[start] = [0, -1];

const queue = [start];
while (queue.length > 0) {
  const x = queue.shift();
  if (x === 1) break;
  const cost = dp[x][0];
  const avaiables = [];
  if (x > 1) {
    avaiables.push(x - 1);
  }
  if (Number.isInteger(x / 2)) {
    avaiables.push(x / 2);
  }
  if (Number.isInteger(x / 3)) {
    avaiables.push(x / 3);
  }
  for (const toQueue of avaiables) {
    if (dp[toQueue]) continue;
    dp[toQueue] = [cost + 1, x];
    queue.push(toQueue);
  }
}

let out = dp[1][0] + "\n";
const track = [];
let toMove = dp[1][1];
while (true) {
  track.push(toMove);
  if (toMove === -1) break;
  toMove = dp[toMove][1];
}
track.pop()
track.reverse();
track.push(1);
out += track.join(" ");
console.log(out.trim());
