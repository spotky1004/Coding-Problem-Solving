const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 3
IOX
OXP
XPP`
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
const campus = input.map(v => Array.from(v));

const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];

const queue = [];
loop: for (let y = 0; y < N; y++) {
  for (let x = 0; x < M; x++) {
    if (campus[y][x] === "I") {
      queue.push([x, y]);
      campus[y][x] = "X";
      break loop;
    }
  }
}

let count = 0;
for (const [x, y] of queue) {
  for (const [dx, dy] of directions) {
    const [tx, ty] = [x + dx, y + dy];
    if (checkOOB(tx, ty) || campus[ty][tx] === "X") continue;
    if (campus[ty][tx] === "P") count++;
    campus[ty][tx] = "X";
    queue.push([tx, ty]);
  }
}

console.log(count || "TT");
