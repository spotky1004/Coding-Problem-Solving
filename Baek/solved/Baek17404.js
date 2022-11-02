const isDev = process.platform !== "linux";
const [, ...houses] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
26 40 83
49 60 57
13 89 99
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

function search(firstCol) {
  let dp = [Infinity, Infinity, Infinity];
  dp[firstCol] = houses[0][firstCol];
  for (let i = 1; i < houses.length; i++) {
    const [r, g, b] = houses[i];
    dp = [
      Math.min(dp[1] + r, dp[2] + r),
      Math.min(dp[0] + g, dp[2] + g),
      Math.min(dp[0] + b, dp[1] + b)
    ];
  }
  dp[firstCol] = Infinity;
  return Math.min(...dp);
}

console.log(Math.min(search(0), search(1), search(2)));
