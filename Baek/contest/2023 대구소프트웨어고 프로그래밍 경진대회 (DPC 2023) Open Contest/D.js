const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 1
2
redstone_block 0 0
redstone_lamp 1 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

/**
 * @param {number} x 
 * @param {number} y 
*/
function checkOOB(x, y) {
  if (
    0 > x || x >= W ||
    0 > y || y >= H
  ) return true;
  return false;
}



const [W, H] = input.shift().map(Number);
const [N] = input.shift().map(Number);
const blocks = input.map(v => [v[0], +v[1], +v[2]]);

const queue = [];
const lamps = [];
const dustExists = Array.from({ length: H }, _ => Array(W).fill(false));
const power = Array.from({ length: H }, _ => Array(W).fill(0));
const visited = Array.from({ length: H }, _ => Array(W).fill(false));
for (const [type, x, y] of blocks) {
  if (type === "redstone_dust") {
    dustExists[y][x] = true;
  } else if (type === "redstone_block") {
    queue.push([x, y]);
    visited[y][x] = true;
    power[y][x] = 16;
  } else if (type === "redstone_lamp") {
    lamps.push([x, y]);
  }
}

const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];
for (const [x, y] of queue) {
  const curPower = power[y][x];
  if (curPower === 1) continue;

  for (const [dx, dy] of directions) {
    const [tx, ty] = [x + dx, y + dy];
    if (
      checkOOB(tx, ty) ||
      !dustExists[ty][tx] ||
      visited[ty][tx]
    ) continue;
    power[ty][tx] = curPower - 1;
    visited[ty][tx] = true;
    queue.push([tx, ty]);
  }
}

for (const [x, y] of lamps) {
  let maxPower = 0;
  for (const [dx, dy] of directions) {
    const [tx, ty] = [x + dx, y + dy];
    if (checkOOB(tx, ty)) continue;
    maxPower = Math.max(maxPower, power[ty][tx]);
  }
  if (maxPower < 1) {
    console.log("failed");
    process.exit(0);
  }
}
console.log("success");
