const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10000`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const dp = [null, 1, 3];
for (let i = dp.length; i <= N; i++) {
  dp.push((dp[i - 1] + 2 * dp[i - 2]) % 10007);
}
console.log(dp[N]);
