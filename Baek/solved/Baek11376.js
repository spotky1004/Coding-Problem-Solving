const isDev = process?.platform !== "linux";
const [[N, M], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 5
5 1 2 3 4 5
2 1 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number} leftCount 
 * @param {number} rightCount 
 * @param {number[][]} connections 
 * @returns 
*/
function bipartiteMatching(leftCount, rightCount, connections) {
  const occuipedBy = Array(rightCount).fill(-1);

  let done = Array(rightCount).fill(false);
  function match(idx) {
    for (const r of connections[idx]) {
      if (done[r]) continue;
      done[r] = true;
      
      if (
        occuipedBy[r] === -1 ||
        (occuipedBy[r] !== idx && match(occuipedBy[r]))
      ) {
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
  return occuipedBy.filter(v => v !== -1).length;
}



const workers = [];
for (let i = 0; i < N; i++) {
  workers.push(datas[i].slice(1).map(v => v - 1));
}

console.log(bipartiteMatching(N, M, workers));
