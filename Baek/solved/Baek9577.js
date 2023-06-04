const isDev = process?.platform !== "linux";
const [[T], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
3 2
1 3 1 1
0 3 3 1 2 3
5 3
1 3 2 5 4
2 10 3 2 3
9 11 1 1`
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
  let shardLeft = rightCount;
  const occuipedBy = Array(rightCount).fill(-1);

  let done = Array(rightCount).fill(false);
  function match(idx) {
    for (const r of connections[idx]) {
      if (done[r]) continue;
      done[r] = true;

      if (occuipedBy[r] === -1 || match(occuipedBy[r])) {
        if (occuipedBy[r] === -1) shardLeft--;
        occuipedBy[r] = idx;
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < leftCount; i++) {
    done = Array(rightCount).fill(false);
    match(i);
    if (shardLeft === 0) return i + 1;
  }
  return -1;
}



let i = 0;
const out = [];
while (i < lines.length) {
  const [n, m] = lines[i++];
  const connections = Array.from({ length: 101 }, _ => []);
  for (let j = 0; j < m; j++) {
    const [t1, t2, a, ...shards] = lines[i];
    for (let k = t1; k < t2; k++) {
      for (const shard of shards) {
        if (connections[k].includes(shard - 1)) continue;
        connections[k].push(shard - 1);
      }
    }
    i++;
  }
  connections.map(v => v.sort((a, b) => a - b));

  const timeSpent = bipartiteMatching(101, n, connections);
  out.push(timeSpent);
}
console.log(out.join("\n"));
