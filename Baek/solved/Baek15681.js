const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`9 5 3
1 3
4 3
5 4
5 6
6 7
2 3
9 6
6 8
5
4
8
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const [N, R] = input.shift();
const lines = input.splice(0, N - 1);
/** @type {number[][]} */
const nodeLines = Array(N + 1).fill().map(_ => []);
for (const [from, to] of lines) {
  nodeLines[from].push(to);
  nodeLines[to].push(from);
}
const questions = input.map(v => v[0]);

const dp = Array(N + 1).fill();
function search(node) {
  const lines = nodeLines[node];
  let count = 1;
  dp[node] = 1;
  for (const toSearch of lines) {
    if (dp[toSearch]) continue;
    count += search(toSearch);
  }
  dp[node] = count;
  return count;
}
search(R);

let out = "";
for (const node of questions) {
  out += dp[node] + "\n";
}
console.log(out.trim());
