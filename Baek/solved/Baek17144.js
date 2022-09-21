const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7 8 3
0 0 0 0 0 0 0 9
0 0 0 0 3 0 0 8
-1 0 5 0 0 0 22 0
-1 8 0 0 0 0 0 0
0 0 0 0 0 10 43 0
0 0 5 0 15 0 0 0
0 0 40 0 0 0 20 0
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/** @type {[number, number, number]} */
const [r, c, T] = input.shift();
const field = input.splice(0, r);
/** @type {[number, number]} */
const [airX, airY] = [
  0,
  field.findIndex(row => row[0] === -1)
];
field[airY][airX] = 0;
field[airY+1][airX] = 0;
/** @type {([x: number, y: number] | null)[][]} */
const airField = [];
for (let y = 0; y < r; y++) {
  const row = [];
  airField.push(row);
  for (let x = 0; x < c; x++) {
    if (y <= airY) {
      if (x === 0) {
        row.push([0, 1]);
      } else if (y === 0) {
        row.push([-1, 0]);
      } else if (x+1 === c) {
        row.push([0, -1]);
      } else if (y === airY) {
        row.push([1, 0]);
      } else {
        row.push(null);
      }
    } else {
      if (x === 0) {
        row.push([0, -1]);
      } else if (y+1 === r) {
        row.push([-1, 0]);
      } else if (x+1 === c) {
        row.push([0, 1]);
      } else if (y === airY+1) {
        row.push([1, 0]);
      } else {
        row.push(null);
      }
    }
  }
}

function doSpread(x, y, dustLevel) {
  if (dustLevel < 0) return;
  const spreadPos = [
    [x+1, y],
    [x-1, y],
    [x, y+1],
    [x, y-1]
  ];
  let dustSpreaded = 0;
  const spreadCount = Math.floor(dustLevel / 5);
  for (const pos of spreadPos) {
    const [sx, sy] = pos;
    if (
      0 > sx || sx >= c ||
      0 > sy || sy >= r ||
      (sx === airX && (sy === airY || sy === airY+1))
    ) continue;
    field[sy][sx] += spreadCount;
    dustSpreaded += spreadCount;
  }
  field[y][x] -= dustSpreaded;
}

for (let t = 0; t < T; t++) {
  /** @type {[x: number, y: number, curDustLevel: number]} */
  const spreadQueue = [];
  for (let y = 0; y < r; y++) {
    for (let x = 0; x < c; x++) {
      const dustLevel = field[y][x];
      if (dustLevel <= 0) continue;
      spreadQueue.push([x, y, dustLevel]);
    }
  }
  for (const toSpread of spreadQueue) {
    void doSpread(...toSpread);
  }
  /** @type {[x: number, y: number, newX: number, newY: number, curDustLevel: number][]} */
  const airQueue = [];
  for (let y = 0; y < r; y++) {
    for (let x = 0; x < c; x++) {
      const air = airField[y][x];
      if (air === null) continue;
      airQueue.push([x, y, x+air[0], y+air[1], field[y][x]]);
    }
  }
  for (const airMove of airQueue) {
    const [x, y] = airMove;
    field[y][x] = 0;
  }
  for (const airMove of airQueue) {
    const [, , newX, newY, dustLevel] = airMove;
    if (
      newX === airX && (newY === airY || newY === airY+1)
    ) continue;
    field[newY][newX] = dustLevel;
  }
  if (isDev) {
    console.table(field);
  }
}

console.log(field.reduce((a, b) => a + b.reduce((a, b) => a + b, 0), 0))
