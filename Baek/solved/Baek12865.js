const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 1
2 2
2 2`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const [N, K] = input.shift();
const items = input.splice(0, N);

const dp = [];
for (const [weight, value] of items) {
  for (let i = K - 1; i >= 0; i--) {
    const dpValue = dp[i];
    if (!dpValue) continue;
    const mergedValue = dpValue + value;

    const dpValueToChange = dp[i + weight];
    if (
      i + weight <= K &&
      (!dpValueToChange || dpValueToChange < mergedValue)
    ) dp[i + weight] = mergedValue;
  }
  if (
    K >= weight &&
    (!dp[weight] || value > dp[weight])
  ) dp[weight] = value;
}

console.log(Math.max(0, ...dp.filter(v => v)));
