const isDev = process?.platform !== "linux";
const [[N, M], ...connections] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 5
1 3
1 4
4 5
4 3
3 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number} V 
 * @param {[a: number, b: number, cost: number]} connections 
 * @returns {number[][]} 
 */
function floydWarshall(V, connections) {
  const costs = Array.from({ length: V }, _ => Array(V).fill(Infinity));
  for (let i = 0; i < V; i++) {
    costs[i][i] = 0;
  }
  for (const [a, b, cost] of connections) {
    costs[a - 1][b - 1] = cost;
    costs[b - 1][a - 1] = cost;
  }

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        const newCost = Math.min(costs[i][j], costs[i][k] + costs[k][j]);
        costs[i][j] = newCost;
        costs[j][i] = newCost;
      }
    }
  }
  return costs;
}

const nums = floydWarshall(N, connections.map(v => [...v, 1])).map(v => v.reduce((a, b) => a + b, 0));
console.log(nums.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0])[0][1] + 1);
