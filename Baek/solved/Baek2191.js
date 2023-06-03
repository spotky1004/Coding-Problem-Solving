const isDev = process?.platform !== "linux";
const [[N, M, S, V], ...poses] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 2 5 10
1.0 1.0
2.0 2.0
100.0 100.0
20.0 20.0`
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
  function match(idx) {
    for (const r of connections[idx]) {
      if (done[r]) continue;
      done[r] = true;

      if (occuipedBy[r] === -1 || match(occuipedBy[r])) {
        occuipedBy[r] = idx;
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < leftCount; i++) {
    done = Array(rightCount).fill(false);
    match(i);
  }
  return occuipedBy.filter(v => v !== -1).length;
}



const maxDist = S * V;
const mousePoses = poses.splice(0, N);
const holePoses = poses.splice(0, M);

const connections = [];
for (let i = 0; i < N; i++) {
  const connection = [];
  connections.push(connection);

  const [ax, ay] = mousePoses[i];
  for (let j = 0; j < M; j++) {
    const [bx, by] = holePoses[j];
    const dist = Math.sqrt((ax - bx)**2 + (ay - by)**2);
    if (dist > maxDist) continue;
    connection.push(j);
  }
}

console.log(N - bipartiteMatching(N, M, connections));
