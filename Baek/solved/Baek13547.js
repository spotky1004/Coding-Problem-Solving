const isDev = process?.platform !== "linux";
const [[N], A, [M], ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
1 1 2 1 3
5
1 5
2 4
3 5
3 3
5 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const SQRT_N = Math.floor(Math.sqrt(N));
const sortedQueries = queries.map((v, i) => [i, v[0] - 1, v[1] - 1]).sort((a, b) => {
  const iDiff = Math.floor(a[1] / SQRT_N) - Math.floor(b[1] / SQRT_N);
  if (iDiff !== 0) return iDiff;
  return a[2] - b[2];
});

let numCount = 0;
const numAcc = Array(10000001).fill(0);
function changeAcc(idx, d) {
  const n = A[idx];
  if (d === 1 && numAcc[n] === 0) numCount++;
  if (d === -1 && numAcc[n] === 1) numCount--;
  numAcc[n] += d;
}

const out = Array(M);
let s = 0, e = -1;
for (const [idx, l, r] of sortedQueries) {
  while (e < r) changeAcc(++e, 1);
  while (e > r) changeAcc(e--, -1);
  while (s < l) changeAcc(s++, -1);
  while (s > l) changeAcc(--s, 1);
  out[idx] = numCount;
}
console.log(out.join("\n"));
