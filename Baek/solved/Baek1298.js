const isDev = process?.platform !== "linux";
const [[N, M], ...guesses] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 5
1 1
2 2
3 3
4 4
5 5`
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



const connections = Array.from({ length: N }, _ => []);
for (let i = 0; i < M; i++) {
  const [a, b] = guesses[i];
  connections[a - 1].push(b - 1);
}

console.log(bipartiteMatching(N, N, connections));
