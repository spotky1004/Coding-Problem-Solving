const isDev = process?.platform !== "linux";
const [[T], ...cases] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
4
7
10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const dp = [0, 1, 2, 4];
for (let i = dp.length; i <= 11; i++) {
  dp.push(dp[i - 1] + dp[i - 2] + dp[i - 3]);
}

const out = [];
for (const n of cases) {
  out.push(dp[n]);
}
console.log(out.join("\n"));
