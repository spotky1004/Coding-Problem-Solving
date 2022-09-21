/** @type {[number, number][]} */
const datas = (require('fs').readFileSync("dev/stdin")+"").trim().split("\n").slice(1).map(e => e.split(" ").map(Number));
/** @type {number[][]} */
const nodes = Array(datas.length + 2).fill().map(_ => []);
/** @type {number[]} */
const parents = [-1, -1];

for (const data of datas) {
  const [n, m] = data;
  nodes[n].push(m);
  nodes[m].push(n);
}

function bfs() {
  const queue = nodes[1].slice();
  for (const n of queue) {
    parents[n] = 1;
  }
  while (queue.length > 0) {
    const parent = queue.shift();
    for (const n of nodes[parent]) {
      if (n === parents[parent]) continue;
      queue.push(n);
      parents[n] = parent;
    }
  }
}
bfs();

console.log(parents.slice(2).join("\n"));
