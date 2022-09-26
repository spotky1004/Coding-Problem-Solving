const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 30
100 100 100000
1 1 100
15 15 30
`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

/** @type {[number, number]} */
const [N, T] = input.shift();
/** @type {number[]} */
const M = input.shift();
/** @type {number[]} */
const P = input.shift();
/** @type {number[]} */
const R = input.shift();
/** @type {number[]} */
const problems = M.map((_, i) => [M[i], P[i], R[i]])
  .sort(([am, ap, ar], [bm, bp, br]) => (bm-br*bp) - (am-ar*ap));

/** @type {number[]} */
const dp = [];
for (let i = 0; i < N; i++) {
  const [m, p, r] = problems[i];
  if (r > T) continue;
  for (let j = Math.min(dp.length - 1, T - r); j >= 0; j--) {
    const scoreGot = m-(r+j)*p;
    if (scoreGot <= 0) break;
    const dpValue = dp[j];
    if (typeof dpValue === "undefined") continue;
    dp[r+j] = Math.max(dpValue + scoreGot, dp[r+j] ?? 0);
  }
  const scoreGot = m-r*p;
  if (scoreGot <= 0) continue;
  dp[r] = Math.max(m-r*p, dp[r] ?? 0);
}

console.log(Math.max(0, ...dp.filter(v => v)));
