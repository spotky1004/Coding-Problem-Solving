const isDev = process?.platform !== "linux";
const [[N], ...sharks] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 2 1
4 3 5
3 1 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number} leftCount 
 * @param {number} rightCount 
 * @param {number[][]} connections 
 * @returns {number} 
*/
function bipartiteMatching(leftCount, rightCount, connections) {
  const occuipedBy = Array(rightCount).fill(-1);

  let done = Array(rightCount).fill(false);
  function match(idx, cantMatchIdx = -1) {
    for (const r of connections[idx]) {
      if (
        r < idx ||
        done[r] ||
        r === cantMatchIdx
      ) continue;
      done[r] = true;

      if (occuipedBy[r] === -1 || match(occuipedBy[r], idx)) {
        occuipedBy[r] = idx;
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < leftCount; i++) {
    done = Array(rightCount).fill(false);
    match(i);
    done = Array(rightCount).fill(false);
    match(i);
  }

  return occuipedBy.filter(v => v > -1).length;
}



sharks.sort((a, b) => {
  const [ax, ay, az] = a;
  const [bx, by, bz] = b;
  if (ax > bx && ay > by && az > bz) return 1;
  if (ax < bx && ay < by && az < bz) return -1;
  return 0;
});

const rawConnections = [];
for (let i = 0; i < N; i++) {
  const connection = [];
  rawConnections.push(connection);
  
  const [ax, ay, az] = sharks[i];
  for (let j = 0; j < N; j++) {
    if (i === j) continue;
    const [bx, by, bz] = sharks[j];
    if (ax >= bx && ay >= by && az >= bz) {
      connection.push(j);
    }
  }
}

const sortedConnections = rawConnections.map((v, i) => [i, ...v]).sort((a, b) => b.length - a.length).map(v => v[0]);
const connections = [];
for (let i = 0; i < N; i++) {
  const rawConnection = rawConnections[sortedConnections[i]];
  const connection = [];
  connections.push(connection);

  for (const r of rawConnection) {
    connection.push(sortedConnections.findIndex(v => v === r));
  }
}

console.log(N - bipartiteMatching(N, N, connections));
