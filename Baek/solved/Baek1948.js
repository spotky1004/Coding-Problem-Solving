const isDev = process?.platform !== "linux";
const [[V], [m], ...roads] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
7
1 2 1
1 3 3
2 3 2
2 4 1
4 5 1
3 5 1
2 5 3
1 5
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
roads.pop();

class Node {
  /** @type {number} */
  n
  /** @type {Node[]} */
  parents = [];
  /** @type {Node[]} */
  childs = [];

  constructor(n) {
    this.n = n;
  }
  
  addParent(parent) {
    if (this.parents.includes(parent)) return;
    this.parents.push(parent);
  }

  removeParent(parent) {
    const idx = this.parents.findIndex(n => n === parent);
    if (idx === -1) return;
    this.parents.splice(idx, 1);
  }

  addChild(child) {
    if (this.childs.includes(child)) return;
    this.childs.push(child);
  }
}

const nodes = Array.from({ length: V + 1 }, (_, i) => new Node(i));
const costs = Array.from({ length: V + 1 }, _ => []);
for (const [from, to, cost] of roads) {
  const a = nodes[from];
  const b = nodes[to];
  a.addParent(b);
  b.addChild(a);
  costs[to].push(cost);
}
const parents = nodes.map(node => node.childs.map(v => v.n));
nodes.shift();

const sorted = [];
while (nodes.length > 0) {
  const idx = nodes.findIndex(v => v && v.parents.length === 0);
  const toRemove = nodes[idx];
  if (!toRemove) break;
  toRemove.childs.forEach(n => n.removeParent(toRemove));
  sorted.push(toRemove.n);
  nodes[idx] = null;
}
sorted.reverse();

const [, e] = [sorted[0], sorted[sorted.length - 1]];
let maxCost = 0;
const maxCosts = Array.from({ length: V + 1 }, _ => [0, []]);
for (const node of sorted) {
  const parent = parents[node];
  const cost = costs[node];
  for (let i = 0; i < parent.length; i++) {
    const p = parent[i];
    const curCost = maxCosts[p][0] + cost[i];
    if (curCost > maxCosts[node][0]) {
      maxCosts[node] = [curCost, []];
    }
    if (curCost === maxCosts[node][0]) {
      maxCosts[node][1].push(p);
    }

    maxCost = Math.max(maxCost, curCost);
  }
}

let instantRoads = new Set(maxCosts[e][1].map(v => `${v} ${e}`));
for (const instantRoad of instantRoads) {
  const [from] = instantRoad.split(" ");
  const newRoads = maxCosts[from][1].map(v => `${v} ${from}`);
  for (const newRoad of newRoads) {
    instantRoads.add(newRoad)
  }
}

console.log(maxCost + "\n" + instantRoads.size);
