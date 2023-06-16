const isDev = process?.platform !== "linux";
const [[N, M], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 5
1
3
5
7
10
2
4
8
5
6`
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



const sailors = datas.splice(0, N).flat();
const karas = datas.flat();

const connections = [];
for (const w of sailors) {
  const connection = [];
  connections.push(connection);
  for (let i = 0; i < karas.length; i++) {
    const k = karas[i];
    if (
      (w/2 <= k && k <= w*3/4) ||
      (w <= k && k <= w * 5/4)
    ) {
      connection.push(i);
    }
  }
}

console.log(bipartiteMatching(N, M, connections));
