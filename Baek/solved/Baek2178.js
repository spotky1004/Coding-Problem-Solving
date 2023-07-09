const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 25
1011101110111011101110111
1110111011101110111011101`
)
  .trim()
  .split("\n");

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



const [N, M] = input.shift().split(" ").map(Number);
const maze = input.map(v => Array.from(v).map(Number));

const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];

const queue = [[0, 0]];
maze[0][0] = 2;

let count = 0;
for (const [x, y] of queue) {
  const curLen = maze[y][x];

  for (const [dx, dy] of directions) {
    const [tx, ty] = [x + dx, y + dy];
    if (checkOOB(tx, ty) || maze[ty][tx] !== 1) continue;
    maze[ty][tx] = curLen + 1;
    queue.push([tx, ty]);
  }
}

console.log(maze[N - 1][M - 1] - 1);
