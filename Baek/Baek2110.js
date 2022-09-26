const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 3
1
4
7
10
`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const [N, C] = input.shift();
const houses = input.splice(0, N).sort((a, b) => a - b);

const [, maxHouse] = houses.reduce(([min, max], x) => {
  return [Math.min(min, x), Math.max(max, x)];
}, [Infinity, -Infinity]);

let maxDist = -Infinity;
let dist = Math.ceil(Math.log2(maxHouse));
let move = dist;
for (let i = 0; i < Math.ceil(Math.log2(maxHouse)) + 1; i++) {
  let prevPlaced = -Infinity;
  let placedCount = 0;
  for (let j = 0; j < houses.length; j++) {
    const x = houses[j];
    
    if (x - prevPlaced >= dist) {
      prevPlaced = x;
      placedCount++;
    }
  }
  console.log(placedCount, dist, move);
  if (placedCount === C) {
    maxDist = Math.max(maxDist, dist);
    move = 1 * Math.ceil(Math.abs(move) / 2);
    dist += move;
  } else {
    move = -1 * Math.ceil(Math.abs(move) / 2);
    dist += move;
  }
}

console.log(maxDist);
