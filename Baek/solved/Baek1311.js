const isDev = process.platform !== "linux";
const [[N], ...costs] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
108 125 150
150 135 175
122 148 250`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const memo = [0];
let minCost = Infinity;
let n = 0;
let queue = [0];
let nextQueue = [];
while (queue.length > 0) {
  const visited = queue.pop();
  const cost = memo[visited];
  for (let i = 0; i < N; i++) {
    if (!((visited>>i)&1)) {
      const newVisited = visited|(1<<i);
      const newCost = cost + costs[i][n];
      if (n + 1 === N) {
        minCost = Math.min(minCost, newCost);
        continue;
      }
      if (!memo[newVisited]) nextQueue.push(newVisited);
      memo[newVisited] = Math.min(newCost, memo[newVisited] ?? Infinity);
    }
  }
  if (queue.length === 0) {
    queue = nextQueue;
    nextQueue = [];
    n++;
  }
}

console.log(minCost);
