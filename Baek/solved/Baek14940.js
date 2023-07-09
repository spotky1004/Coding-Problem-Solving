const isDev = process?.platform !== "linux";
const [[N, M], ...map] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`15 15
1 0 1 1 1 1 1 1 1 1 1 1 1 1 1
0 0 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 0 0 0 0 1
1 1 1 1 1 1 1 1 1 1 0 1 1 1 1
1 1 1 1 1 1 1 1 1 1 0 1 0 0 0
1 1 1 1 1 1 1 1 1 1 0 1 1 1 2`
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
    0 > x || x >= M ||
    0 > y || y >= N
  ) return true;
  return false;
}



const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];

const queue = [];
loop: for (let y = 0; y < N; y++) {
  for (let x = 0; x < M; x++) {
    if (map[y][x] !== 2) continue;
    queue.push([x, y]);
    map[y][x] = 3;
    break loop;
  }
}

for (const [x, y] of queue) {
  const curLen = map[y][x];

  for (const [dx, dy] of directions) {
    const [tx, ty] = [x + dx, y + dy];
    if (checkOOB(tx, ty) || map[ty][tx] !== 1) continue;
    map[ty][tx] = curLen + 1;
    queue.push([tx, ty]);
  }
}

console.log(map.map(row => row.map(v => v === 1 ? -1 : Math.max(0, v - 3)).join(" ")).join("\n"));
