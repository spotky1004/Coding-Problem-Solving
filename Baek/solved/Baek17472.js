const isDev = process.platform !== "linux";
const [, ...map] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7 8
1 0 0 1 1 1 0 0
0 0 1 0 0 0 1 1
0 0 1 0 0 0 1 1
0 0 1 1 1 0 0 0
0 0 0 0 0 0 0 0
0 1 1 1 0 0 0 0
1 1 1 1 1 1 0 0
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => Boolean(Number(v))));

const [N, M] = [map.length, map[0].length];

const directions = [
  [-1, 0], [1, 0],
  [0, -1], [0, 1]
];

let islandPoses = [];
let V = 0;
for (let y = 0; y < N; y++) {
  for (let x = 0; x < M; x++) {
    if (map[y][x] === true) {
      const islandPos = [];
      islandPoses.push(islandPos);
      V++;

      /** @type {[x: number, y: number][]} */
      const queue = [[x, y]];
      map[y][x] = V;
      while (queue.length > 0) {
        const [sx, sy] = queue.shift();
        islandPos.push([sx, sy]);
        for (const [dx, dy] of directions) {
          const [tx, ty] = [sx + dx, sy + dy];
          if (
            0 > tx || tx >= M ||
            0 > ty || ty >= N ||
            map[ty][tx] !== true
          ) continue;

          map[ty][tx] = V;
          queue.push([tx, ty]);
        }
      }
    }
  }
}

/** @type {[from: number, to: number, cost: number][]} */
const lines = [];
for (let i = 0; i < V; i++) {
  const islandNr = i + 1;
  const islandPos = islandPoses[i];
  const minCosts = Array(V).fill(Infinity);
  for (const [x, y] of islandPos) {
    for (const [dx, dy] of directions) {
      const [sx, sy] = [x + dx, y + dy];
      if (
        typeof map[sy] === "undefined" ||
        map[sy][sx] !== false
      ) continue;
      let cost = 0;
      let [mx, my] = [x + dx, y + dy];
      while (
        typeof map[my] !== "undefined" &&
        map[my][mx] === false
      ) {
        cost++;
        mx += dx;
        my += dy;
      }
      const reachedIsland = (map[my] ?? [])[mx];
      if (
        typeof reachedIsland === "undefined" ||
        reachedIsland === islandNr ||
        cost <= 1
      ) continue;
      minCosts[reachedIsland - 1] = Math.min(cost, minCosts[reachedIsland - 1]);
    }
  }
  for (let j = 0; j < minCosts.length; j++) {
    const cost = minCosts[j];
    if (!isFinite(cost) || cost <= 1) continue;
    lines.push([islandNr, j + 1, cost]);
  }
}

const roots = Array.from({ length: V + 1 }, (_, i) => i);

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
  if(find(from) !== find(to)) {
    costAcc += cost;
    union(from, to);
  }
}

if (isDev) {
  console.table(map);
  console.log(lines, roots);
}

const finds = Array.from({ length: V }, (_, i) => i + 1).map(v => find(v));
if (finds.every(v => v === finds[0])) {
  console.log(costAcc);
} else {
  console.log(-1);
}
