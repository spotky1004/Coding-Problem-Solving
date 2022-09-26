const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1 74
502
2
47`
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
  .sort(([am, ap, ar], [bm, bp, br]) => (Math.max(0, bm-br*bp) + Math.max(0, am-(ar+br)*ap)) - (Math.max(0, am-ar*ap) + Math.max(0, bm-(br+ar)*bp)));

/** @type {[number, number[]][]} */
const dp = [[0, []]];
for (let l = 0; l < N; l++) {
  for (let i = 0; i < N; i++) {
    const [m, p, r] = problems[i];
    if (r > T) continue;
    for (let j = Math.min(dp.length - 1, T - r); j >= 0; j--) {
      const scoreGot = m-(r+j)*p;
      if (scoreGot <= 0) break;
      if (typeof dp[j] === "undefined") continue;
      const [dpValue, used] = dp[j];
      const prevDp = (dp[r+j] ?? [0, []])[0];
      if (
        used.includes(i) ||
        (dp[r+j] ?? [0])[0] > dpValue + scoreGot ||
        (
          (dp[r+j] ?? [0])[0] === dpValue + scoreGot &&
          prevDp.length < used.length + 1
        )
      ) continue;
      dp[r+j] = [dpValue + scoreGot, [...used, i]];
    }
  }
}

console.log(Math.max(0, ...dp.map(v => v[0]).filter(v => v)));
