const isDev = process?.platform !== "linux";
const [[N], A, [Q], L] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
1
7
8`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const stickCounts = Array(100001).fill(0);
for (const a of A) {
  stickCounts[a]++;
}

const dp = [0];
for (let i = 1; i < 100001; i++) {
  let sum = stickCounts[i];
  const sqrt = Math.ceil(Math.sqrt(i + 1));
  const fac = [];
  for (let j = 0; j <= sqrt; j++) {
    if (i % j !== 0) continue;
    sum += dp[j] ?? 0;
    fac.push(i / j);
  }
  for (const f of fac) {
    if (f === sqrt) continue;
    sum += dp[f] ?? 0;
  }
  dp.push(sum);
}

const out = [];
for (let l of L) {
  out.push(dp[l]);
}
console.log(out.join(" "));
