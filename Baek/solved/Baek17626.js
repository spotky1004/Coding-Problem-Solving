const isDev = process?.platform !== "linux";
const [[n]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`11339`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const dp = [0];
for (let i = 1; i <= n; i++) {
  let min = Infinity;
  for (let j = 1; j**2 <= i; j++) {
    min = Math.min(min, dp[i - j**2] + 1);
  }
  dp.push(min);
}
console.log(dp[n]);
