const isDev = process?.platform !== "linux";
const [[N, K]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1007 15`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// let liveCount = N;
// let startIdx = 0;
// let endIdx = N - 1;
// let jump = 1;

// while (liveCount > 1) {
//   jump *= K;
//   endIdx = startIdx + jump * Math.floor(liveCount / jump);
//   liveCount = Math.ceil(liveCount / jump);
  
//   const prevStart = startIdx;
//   startIdx = (endIdx + jump + (jump - 1)) % N;
//   liveCount -= (startIdx - prevStart) / jump;

//   console.log(liveCount, startIdx, endIdx, jump);
// }
// console.log(startIdx + 1);

const animals = Array(N).fill(true);
let liveCount = N;

let curWatching = 0;
let toKill = 0;
let i = 0;
while (liveCount > 1) {
  if (!animals[i]) {
    i = (i + 1) % N;
    continue;
  }
  if (toKill > 0 && i === curWatching) break;

  if (toKill === 0) {
    curWatching = i;
    toKill = K - 1;
  } else {
    animals[i] = false;
    toKill--;
    liveCount--;
  }
  i = (i + 1) % N;
}
console.log(curWatching + 1);
