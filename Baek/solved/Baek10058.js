const isDev = process?.platform !== "linux";
const [[n, d], ...sensors] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 1
0 0
0 1
1 0
1 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const connections = Array.from({ length: n }, _ => []);
for (let i = 0; i < n; i++) {
  const [ax, ay] = sensors[i];
  for (let j = i + 1; j < n; j++) {
    if (i === j) continue;
    const [bx, by] = sensors[j];
    const dist = Math.sqrt((ax - bx)**2 + (ay - by)**2);
    if (dist > d) continue;
    connections[i].push(j);
    connections[j].push(i);
  }
}

let max = 1;
let maxClique = [0];
function search(idx1, idx2) {
  if (connections[idx1].length < max) return [idx1, idx2];

  const clique = [idx1, idx2];
  for (let i = 0; i < n; i++) {
    if (
      i === idx1 || i === idx2 ||
      connections[i].length < max
    ) continue;

    let j = 0;
    for (const c of connections[i]) {
      if (c > clique[j]) break;
      if (c === clique[j]) j++;
    }
    if (j === clique.length) {
      if (idx2 < i) {
        clique.push(i);
      } else if (idx1 < i && i < idx2) {
        clique.pop();
        clique.push(i);
        clique.push(idx2);
      } else {
        clique.pop();
        clique.pop();
        clique.push(i);
        clique.push(idx1);
        clique.push(idx2);
      }
    }
  }
  return clique;
}
for (let i = 0; i < n; i++) {
  for (const j of connections[i]) {
    if (
      i > j ||
      connections[i].length < max ||
      connections[j].length < max
    ) continue;
    const result = search(i, j);
    if (result.length > max) {
      max = result.length;
      maxClique = result;
    }
  }
}
console.log(max + "\n" + maxClique.map(v => v + 1).join(" "));
