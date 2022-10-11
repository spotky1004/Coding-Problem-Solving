const isDev = process.platform !== "linux";
const [[V], weights, ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7
10 30 40 10 20 20 70
6 7
6 2
4 5
4 3
2 3
1 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const nodeLines = Array(V + 1).fill().map(_ => []);
for (const [from, to] of lines) {
  nodeLines[from].push(to);
  nodeLines[to].push(from);
}

function search(node, from) {
  const weight = weights[node - 1];
  const connectedNodes = nodeLines[node];
  let maxPrev1 = 0;
  let maxPrev1Used = [];
  let maxPrev2 = 0;
  let maxPrev2Used = [];
  for (const nr of connectedNodes) {
    if (nr === from) continue;
    const [[prev1, prev1Used], [prev2, prev2Used]] = search(nr, node);
    if (prev1 >= prev2) {
      maxPrev1 += prev1;
      maxPrev1Used = maxPrev1Used.concat(prev1Used);
    } else {
      maxPrev1 += prev2;
      maxPrev1Used = maxPrev1Used.concat(prev2Used);
    }
    maxPrev2 += prev2;
    maxPrev2Used = maxPrev2Used.concat(prev2Used);
  }
  maxPrev2Used.push(node);
  if (isDev) {
    console.log(node, [[weight + maxPrev2, maxPrev2Used], [maxPrev1, maxPrev1Used]]);
  }
  return [[weight + maxPrev2, maxPrev2Used], [maxPrev1, maxPrev1Used]];
}

const result = search(1).sort((a, b) => b[0] - a[0])[0];
console.log(result[0] + "\n" + result[1].sort((a, b) => a - b).join(" "));
