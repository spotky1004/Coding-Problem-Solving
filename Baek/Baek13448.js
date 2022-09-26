const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 75
250 500 1000
2 4 8
99 75 99
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
const dp = [0];
for (let i = 0; i < N; i++) {
  const [m, p, r] = problems[i];
  if (r > T) continue;
  for (let j = Math.min(dp.length + 1, T - r); j >= 0; j--) {
    const scoreGot = m-(r+j)*p;
    if (scoreGot <= 0) break;
    const dpValue = dp[j];
    if (typeof dpValue === "undefined") continue;
    dp[r+j] = Math.max(dpValue + scoreGot, dp[r+j] ?? 0);
  }
}

console.log(dp, Math.max(0, ...dp.filter(v => v)));
