const isDev = process?.platform !== "linux";
const [[N, M], ...box] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 2
1 -1
-1 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number} x 
 * @param {number} y 
*/
function checkOOB(x, y) {
  if (
    0 > x || x >= N ||
    0 > y || y >= M
  ) return true;
  return false;
}



const queue = [];
for (let y = 0; y < M; y++) {
  for (let x = 0; x < N; x++) {
    if (box[y][x] !== 1) continue;
    queue.push([x, y]);
  }
}

const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];
for (const [sx, sy] of queue) {
  const curTime = box[sy][sx];
  for (const [dx, dy] of directions) {
    const [x, y] = [sx + dx, sy + dy];
    if (checkOOB(x, y) || box[y][x] !== 0) continue;
    box[y][x] = curTime + 1;
    queue.push([x, y]);
  }
}

let maxTime = 0;
loop: for (let y = 0; y < M; y++) {
  for (let x = 0; x < N; x++) {
    const cell = box[y][x];
    if (cell === -1) continue;
    if (cell === 0) {
      maxTime = -1;
      break loop;
    }
    maxTime = Math.max(maxTime, cell - 1);
  }
}
console.log(maxTime);
