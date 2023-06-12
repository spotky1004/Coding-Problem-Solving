const isDev = process?.platform !== "linux";
const [[N, M, K], ...members] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 5 1
3 1 2 3
3 1 2 3
1 5
1 5
1 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number} leftCount 
 * @param {number} rightCount 
 * @param {number} doubleCount 
 * @param {number[][]} connections 
 * @returns {number} 
*/
function bipartiteMatching(leftCount, rightCount, doubleCount, connections) {
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
  for (let i = 0; i < leftCount; i++) {
    done = Array(rightCount).fill(false);
    const result = match(i);
    if (result) doubleCount--;
    if (doubleCount <= 0) break;
  }
  return occuipedBy.filter(v => v !== -1).length;
}



const connections = [];
for (let i = 0; i < N; i++) {
  const [, ...canDo] = members[i];
  connections.push(canDo.map(v => v - 1));
}

console.log(bipartiteMatching(N, M, K, connections));
