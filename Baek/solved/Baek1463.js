const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const calcCount = Array(N + 1).fill(-1);
calcCount[N] = 0;
const queue = [N];
loop: for (const v of queue) {
  const cur = calcCount[v];

  const next = [v - 1];
  if (v % 2 === 0) next.push(v / 2);
  if (v % 3 === 0) next.push(v / 3);
  for (const w of next) {
    if (calcCount[w] !== -1) continue;
    calcCount[w] = cur + 1;
    queue.push(w);
    if (w === 1) break loop;
  }
}

console.log(calcCount[1]);
