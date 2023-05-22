const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6 8
S C
SPUCDP
1 2
1 3
2 3
2 4
2 6
3 4
4 5
5 6`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

const [N, M] = input.shift().map(Number);
const [S, E] = input.shift();
const a = Array.from(input.shift()[0]);

const startIndexes = [];
const endIndexes = [];
for (let i = 0; i < N; i++) {
  if (a[i] === S) startIndexes.push(i + 1);
  if (a[i] === E) endIndexes.push(i + 1);
}

const connections = Array.from({ length: N + 1 }, _ => []);
const edges = input.splice(0, M);
for (const [a, b] of edges) {
  connections[a].push(b);
  connections[b].push(a);
}

let dists = Array(N + 1).fill(Infinity);
let searching = [...endIndexes];
let searchQueued = Array(1_000_000).fill(-1);
let depth = 0;
while (searching.length > 0) {
  const newDepth = depth + 1;
  let nextSearch = [];
  for (const idx of searching) {
    dists[idx] = Math.min(dists[idx], depth);
    for (const to of connections[idx]) {
      if (newDepth >= dists[to]) continue;
      dists[to] = newDepth;
      if (searchQueued[to] < depth) {
        nextSearch.push(to);
        searchQueued[to] = depth;
      }
    }
  }
  
  searching = nextSearch;
  depth++;
}

let minStarts = [];
let minDist = Infinity
for (const idx of startIndexes) {
  const dist = dists[idx];
  if (dist < minDist) {
    minDist = dist;
    minStarts = [];
  }
  if (dist === minDist) {
    minStarts.push(idx);
  }
}

if (!Number.isFinite(minDist)) {
  console.log("Aaak!");
  process.exit(0);
}

let out = [S];
let searchingDist = minDist - 1;
let searchingNodes = [...minStarts];
searchQueued = Array(1_000_000).fill(Infinity);
while (searchingDist >= 0) {
  let minChar = "Z";
  let nextSearchNodes = [];
  for (const idx of searchingNodes) {
    for (const to of connections[idx]) {
      if (dists[to] !== searchingDist) continue;
      const toChar = a[to - 1];
      if (toChar < minChar) {
        minChar = toChar;
        nextSearchNodes = [];
      }
      if (toChar === minChar && searchingDist < searchQueued[to]) {
        nextSearchNodes.push(to);
        searchQueued[to] = searchingDist;
      }
    }
  }

  searchingNodes = nextSearchNodes;
  out.push(minChar);
  searchingDist--;
}

console.log(out.join(""));
