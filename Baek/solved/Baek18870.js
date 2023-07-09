const isDev = process?.platform !== "linux";
const [[N], X] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
1000 999 1000 999 1000 999`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const sorted = X.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);

const out = Array(N);
let sameCount = 0;
let prev = -Infinity;
for (let i = 0; i < N; i++) {
  const [v, idx] = sorted[i];
  if (v === prev) sameCount++;
  out[idx] = i - sameCount;
  prev = v;
}

console.log(out.join(" "));
