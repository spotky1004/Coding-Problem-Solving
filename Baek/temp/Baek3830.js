const lines = require("fs").readFileSync("/dev/stdin").toString()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
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

  if (a === b) return;

  if (rank[a] < rank[b]) {
    roots[a] = b;
  } else {
    roots[b] = a;
    if (rank[a] === rank[b]) {
      rank[a]++;
    }
  }
}

const UNDEFINED = "undefined";
const UNKNOWN = "UNKNOWN";
const weights = Array(100001).fill(0);
const visited = Array(100001).fill(false);
const rank = Array.from({ length : 100001 }, _ => 1);
const roots = Array.from({ length: 100001 }, (_, i) => i);
const adjV = Array.from({ length: 100001 }, () => []);
const adjDiff = Array.from({ length: 100001 }, () => []);

let line = 0;
const out = [];
while (true) {
  const [N, M] = lines[line++];
  if (N === 0 && M === 0) break;
  const lineS = line, lineE = line + M - 1;
  line += M;

  weights.fill(0);
  visited.fill(false);
  rank.fill(1);
  for (let i = 1; i <= N; i++) {
    roots[i] = i;
    adjV[i].length = 0;
    adjDiff[i].length = 0;
  }

  for (let i = lineS; i <= lineE; i++) {
    const a = lines[i][1], b = lines[i][2], w = lines[i][3];
    if (typeof w === UNDEFINED) continue;
    adjV[a].push(b);
    adjDiff[a].push(w);
    adjV[b].push(a);
    adjDiff[b].push(-w);
  }
  for (let i = 1; i <= N; i++) {
    if (visited[i]) continue;
    visited[i] = true;
    const queue = [];
    queue.push(i);
    for (const u of queue) {
      const adjVU = adjV[u];
      const adjDiffU = adjDiff[u];
      for (let j = 0; j < adjVU.length; j++) {
        const v = adjVU[j];
        const diff = adjDiffU[j];
        if (visited[v]) continue;
        weights[v] = weights[u] + diff;
        visited[v] = true;
        queue.push(v);
      }
    }
  }

  for (let i = lineS; i <= lineE; i++) {
    const a = lines[i][1], b = lines[i][2], w = lines[i][3];
    if (typeof w !== UNDEFINED) {
      union(a, b);
    } else {
      if (find(a) !== find(b)) out.push(UNKNOWN);
      else out.push(weights[b] - weights[a]);
    }
  }
}

// output
console.log(out.join("\n"));
