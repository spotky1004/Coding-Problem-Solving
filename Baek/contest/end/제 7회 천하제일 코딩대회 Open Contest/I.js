const isDev = process?.platform !== "linux";
const [[N, M], ...edges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`9 7
1 2
1 3
2 4
6 8
3 5
6 9
3 6`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const depths = Array(N + 1).fill(-1);
const childs = Array.from({ length: N + 1 }, _ => []);
for (const [a, b] of edges) {
  if (a > b) childs[b].push(a);
  else childs[a].push(b);
}

let visited = Array(N + 1).fill(false);
function init(curNode = 1, depth = 1) {
  visited[curNode] = true;
  depths[curNode] = depth;

  for (const child of childs) {
    if (visited[child]) continue;
    init(child, depth + 1);
  }
}
init();

const water = Array(N + 1).fill(0);
water[1] = 100;
const queue = depths.map((v, i) => [v, i]).slice(1).sort((a, b) => a[1] - b[1]).map(v => v[1]);
for (const idx of queue) {
  const curWater = water[idx];
  const floodWater = curWater / childs[idx].length;
  for (const child of childs[idx]) {
    water[child] += floodWater;
  }
}

let maxWater = 0;
for (let i = 1; i <= N; i++) {
  if (childs[i].length > 0) continue;
  maxWater = Math.max(maxWater, water[i]);
}
console.log(maxWater);
