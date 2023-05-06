const [, ...cases] =
(require('fs').readFileSync(0)+"")
// `3
// 21 20
// 21 20
// 5 20
// 13 20
// 1 3
// 11 3
// 10 3
// 4 8
// 19 8
// 14 8
// 9 7
// 12 7
// 17 7
// 18 6
// 16 6
// 2 6
// 6 15
// 7 15
// 8 15
// 20 15
// 3 15
// 7 6
// 1 2
// 1 3
// 2 4
// 2 5
// 3 6
// 3 7
// 9 8
// 9 3
// 3 6
// 6 2
// 2 1
// 5 2
// 2 7
// 4 3
// 3 8
// `
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];

let i = 0;
while (i < cases.length) {
  const [n, m] = cases[i];
  i++;
  const edges = cases.slice(i, i + m);
  i += m;

  const connections = Array.from({ length: n + 1 }, _ => []);
  for (const [u, v] of edges) {
    connections[u].push(v);
    connections[v].push(u);
  }

  const connectionCounts = connections.slice(1).map(v => v.length - 1);
  const connectionCountAcc = connectionCounts.reduce((acc, cur) => {
    acc[cur]++;
    return acc;
  }, Array(Math.max(...connectionCounts) + 1).fill(0));
  
  let x = connectionCountAcc.findIndex((v, i) => i > 0 && v === 1) + 1;
  if (x === 0) x = connectionCountAcc.findIndex((v, i) => i > 0 && v > 1) + 1;
  const y = connectionCountAcc.findIndex((v, i) => i > 0 && v > 1);

  out.push(x + " " + y);
}

console.log(out.join("\n"));
