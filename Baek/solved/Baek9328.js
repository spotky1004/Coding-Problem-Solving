const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
5 17
*****************
.............**$*
*B*A*P*C**X*Y*.X.
*y*x*a*p**$*$**$*
*****************
cz
5 11
*.*********
*...*...*x*
*X*.*.*.*.*
*$*...*...*
***********
0
7 7
*ABCDE*
X.....F
W.$$$.G
V.$$$.H
U.$$$.J
T.....K
*SQPML*
irony`
)
  .trim()
  .split("\n");

/**
 * @typedef {[x: number, y: number]} Position
 */

const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];
/** @type {(c: string) => boolean} */
const isLowerCase = (c) => "a" <= c && c <= "z";

let i = 1;
while (i < input.length) {
  const [h, w] = input[i].split(" ").map(Number);
  i++;
  const map = input.slice(i, i + h).map(v => Array.from(v));
  i += h;
  const rawKeys = input[i];
  i++;

  const keys = new Set(rawKeys === "0" ? [] : Array.from(rawKeys.toUpperCase()));
  /** @type {Map<string, Position[]>} */
  const doorPositions = new Map(Array.from({ length: 26 }, (_, i) => [(i+10).toString(36).toUpperCase(), []]));
  let docGot = 0;

  /** @type {Position} */
  let queue = [];
  for (let x = 0; x < w; x++) {
    queue.push([x, 0]);
    queue.push([x, h - 1]);
  }
  for (let y = 1; y < h - 1; y++) {
    queue.push([0, y]);
    queue.push([w - 1, y]);
  }
  
  queue = queue.filter(([x, y]) => {
    const tile = map[y][x];
    if (tile === "." || keys.has(tile)) {
      return true;
    }
    if (tile === "$") {
      docGot++;
      return true;
    }
    if (tile === "*") return false;
    if (isLowerCase(tile)) {
      keys.add(tile.toUpperCase());
      return true;
    }
    doorPositions.get(tile).push([x, y]);
    return false;
  });
  for (const [x, y] of queue) {
    map[y][x] = "*";
  }
  /** @type {Position} */
  let nextQueue = [];

  while (queue.length > 0) {
    for (const [x, y] of queue) {
      for (const [dx, dy] of directions) {
        const [nx, ny] = [x + dx, y + dy];
        if (
          typeof map[ny] === "undefined" ||
          typeof map[ny][nx] === "undefined"
        ) continue;

        const tile = map[ny][nx];
        if (tile === "*") continue;
        if (tile === "." || tile === "$" || isLowerCase(tile) || keys.has(tile)) {
          nextQueue.push([nx, ny]);
          map[ny][nx] = "*";
        }
        if (tile === ".") continue;
        if (tile === "$") {
          docGot++;
          continue;
        }
        if (isLowerCase(tile)) {
          keys.add(tile.toUpperCase());
          for (const [px, py] of doorPositions.get(tile.toUpperCase())) {
            if (map[py][px] === "*") continue;
            nextQueue.push([px, py]);
          }
          continue;
        }
        if (!keys.has(tile)) {
          doorPositions.get(tile).push([nx, ny]);
        }
      }
    }

    queue = nextQueue;
    nextQueue = [];
  }

  console.log(docGot);
}
