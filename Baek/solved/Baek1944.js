const isDev = process.platform !== "linux";
const [datas, ...map] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 1
1111
1S01
10K1
1111
`
)
  .trim()
  .split("\n")
  .map(line => Array.from(line));

const [N, V] = datas.join("").split(" ").map(Number);
/** @type {[x: number, y: number]} */
const startPos = [-1, -1];
/** @type {[x: number, y: number][]} */
const keyPoses = [];
/** @type {Map<string, number>} */
const keyMap = new Map();

for (let y = 0; y < N; y++) {
  const row = map[y];
  for (let x = 0; x < N; x++) {
    const tile = row[x];
    if (tile === "S") {
      startPos[0] = x;
      startPos[1] = y;
    } else if (tile === "K") {
      keyMap.set(x + "_" + y, keyPoses.length);
      keyPoses.push([x, y]);
    }
  }
}
keyMap.set(startPos[0] + "_" + startPos[1], keyPoses.length);
keyPoses.push(startPos);

function checkOOB(x, y) {
  if (
    0 > x || x >= N ||
    0 > y || y >= N
  ) return false;
  return true;
}

const directions = [
  [-1, 0], [1, 0],
  [0, -1], [0, 1]
];
/** @type {[from: number, to: number, cost: number][]} */
const lines = [];
/**
 * @param {number} i 
 */
function searchKey(i) {
  const keyPos = keyPoses[i];
  const visitMark = i;
  let dist = 1;
  const queue = [keyPos];
  map[keyPos[1]][keyPos[0]] = visitMark;
  while (queue.length > 0) {
    let loopCount = queue.length;
    for (let t = 0; t < loopCount; t++) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of directions) {
        const [tx, ty] = [x + dx, y + dy];
        const tile = map[ty][tx];
        if (
          !checkOOB(tx, ty) ||
          tile === visitMark ||
          tile === "1"
        ) continue;

        if ((tile === "K" || tile === "S") && i < keyMap.get(tx + "_" + ty)) {
          lines.push([i + 1, keyMap.get(tx + "_" + ty) + 1, dist]);
        }
        map[ty][tx] = visitMark;
        queue.push([tx, ty]);
      }
    }
    dist++;
  }

  for (const [x, y] of keyPoses) {
    map[y][x] = "K";
  }
}

for (let i = 0; i < keyPoses.length; i++) {
  searchKey(i);
}

const roots = Array.from({ length: V + 2 }, (_, i) => i);

/**
 * @param {number} a 
*/
function find(a) {
  if (roots[a] === a) return a;

  const root = find(roots[a]);
  roots[a] = root;
  return root;
}

/**
 * @param {number} a 
 * @param {number} b 
*/
function union(a, b){
  a = find(a);
  b = find(b);

  roots[b] = a;
}



void lines.sort((a, b) => a[2] - b[2]);

let costAcc = 0;
for (const [from, to, cost] of lines) {
  if (find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
  }
}

if (isDev) {
  console.log(lines);
}
const finds = Array.from({ length: V }, (_, i) => i + 1).map(v => find(v));
if (finds.every(v => v === finds[0]) && costAcc > 0) {
  console.log(costAcc);
} else {
  console.log(-1);
}
