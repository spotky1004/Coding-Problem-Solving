const isDev = process.platform !== "linux";
const [[N, M], m, c] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`19 20169
240 2560 434 6 31 577 500 2715 2916 952 2490 258 1983 1576 3460 933 1660 2804 2584
82 77 81 0 36 6 53 78 49 82 82 33 66 8 60 0 98 91 93
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const dp = [];
let minCost = Infinity;
function cleanDp(m) {
  let minAsc = Infinity;
  for (let i = 0; i < dp.length; i++) {
    const [mdp, cdp] = dp[i];
    if (mdp >= m) continue;
    if (cdp >= minAsc) {
      dp.splice(i, 1);
      i--;
    }
    minAsc = Math.min(minAsc, cdp);
  }
}
function pushDp(m, c) {
  if (m >= M) {
    minCost = Math.min(c, minCost);
    return 0;
  }
  let idx = dp.findIndex(v => m >= v[0]);
  if (idx === -1) idx = dp.length;
  let min = Math.min(...dp.slice(0, idx).map(v => v[1]));
  if (min < c) return 0;
  let shift = 0;
  if (dp[idx] && dp[idx][0] === m) {
    dp[idx][1] = Math.min(dp[idx][1], c);
  } else {
    dp.splice(idx, 0, [m, c]);
    shift++;
  }

  cleanDp(m);

  return shift;
}
for (let i = 0; i < N; i++) {
  const mi = m[i];
  const ci = c[i];
  
  for (let j = 0; j < dp.length; j++) {
    const [mdp, cdp] = dp[j];
    const mt = mdp + mi;
    const ct = cdp + ci;
    if (ct > minCost) continue;
    const shift = pushDp(mt, ct);
    if (shift) {
      j += shift;
    }
  }

  pushDp(mi, ci);
  cleanDp(Infinity);
}

console.log(minCost);
