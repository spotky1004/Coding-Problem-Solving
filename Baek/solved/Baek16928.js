const isDev = process.platform !== "linux";
const [, ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 7
32 62
42 68
12 98
95 13
97 25
93 37
79 27
75 19
49 47
67 17`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/** @type {Map<number, number.} */
const lineMap = new Map();
for (const [from, to] of lines) {
  lineMap.set(from, to);
}

const queue = [1];
/** @type {number[]} */
const rollCounts = Array(101).fill(Infinity);
rollCounts[1] = 0;
while (queue.length > 0) {
  const tileNum = queue.shift();
  const curRollCount = rollCounts[tileNum];
  const lineMove = lineMap.get(tileNum);

  /** @type {number[]} */
  let toQueue = [];
  if (lineMove) {
    toQueue.push(lineMove);
  } else {
    for (let i = 1; i <= 6; i++) {
      toQueue.push(tileNum + i);
    }
  }

  const nextRollCount = curRollCount + (lineMove ? 0 : 1);
  for (const tileToQueue of toQueue) {
    if (
      tileToQueue > 100 ||
      rollCounts[tileToQueue] <= nextRollCount
    ) continue;
    rollCounts[tileToQueue] = nextRollCount;
    queue.push(tileToQueue);
  }

  queue.sort((a, b) => rollCounts[a] - rollCounts[b]);
}

console.log(rollCounts[100]);
