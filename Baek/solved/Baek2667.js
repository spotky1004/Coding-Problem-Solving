const isDev = process.platform !== "linux";
let [N, ...map] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`12
110011001100
001100110011
110011001100
001100110011
110011001100
001100110011
110011001100
001100110011
110011001100
001100110011
110011001100
001100110011`
)
  .trim()
  .split("\n").map(line => Array.from(line).map(Number));

N = +N.join("");
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];
const danJiCounts = [];
let danJiBunHo = 1;
while (true) {
  const startY = map.findIndex(line => line.includes(1));
  if (startY === -1) break;
  const startX = map[startY].findIndex(tile => tile === 1);

  danJiCounts.push(0);
  /** @type {[x: number, y: number]} */
  const queue = [[startX, startY]];
  map[startY][startX] = 0;
  while (queue.length > 0) {
    const [x, y] = queue.shift();
    danJiCounts[danJiBunHo - 1]++;
    map[y][x] = 0;
    for (const [dx, dy] of directions) {
      const [mx, my] = [x + dx, y + dy];
      if (
        0 > mx || mx >= N ||
        0 > my || my >= N ||
        map[my][mx] === 0
      ) continue;
      map[my][mx] = 0;
      queue.push([mx, my]);
    }
  }

  danJiBunHo++;
}
console.log((danJiCounts.length.toString() + "\n" + danJiCounts.sort((a, b) => a - b).join("\n")).trim());
