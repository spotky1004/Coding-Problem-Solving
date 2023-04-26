const isDev = process?.platform !== "linux";
const [[V], ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8
1 2
1 3
1 4
2 5
2 6
4 7
4 8`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number).sort((a, b) => a - b));

const connectedNodes = Array.from({ length: V + 1 }, _ => []);
for (const [from, to] of lines) {
  connectedNodes[from].push(to);
  connectedNodes[to].push(from);
}

function solve(idx, parent = -1) {
  const count = [1, 0];

  for (const connectedIdx of connectedNodes[idx]) {
    if (connectedIdx === parent) continue;

    const [down1, down2] = solve(connectedIdx, idx);
    count[0] += Math.min(down1, down2);
    count[1] += down1;
  }

  return count;
}

console.log(Math.min(...solve(1)));
