const isDev = process.platform !== "linux";
const [, values] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 1 1 1 5 5 5 3 3 5 5
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/** @type {number[]} */
const minimums = [values[0]];
let maxVal = -Infinity;
let minVal = Infinity;
let accSign = 0;
for (let i = 1; i < values.length; i++) {
  const diffSign = Math.sign(values[i] - values[i - 1]);
  if (accSign === 0) {
    accSign = diffSign;
  }
  if (diffSign !== 0 && accSign !== diffSign) {
    minimums.push(values[i - 1]);
    accSign = diffSign;
  }
  maxVal = Math.max(maxVal, values[i]);
  minVal = Math.min(minVal, values[i]);
}
minimums.push(values[values.length - 1]);

const dp = [0];
let max = 0;
for (let i = 1; i < minimums.length; i++) {
  let curMax = 0;
  const curValue = minimums[i];
  for (let j = (i + 1) % 2; j < i; j += 2) {
    if (
      (i % 2 === 1 && maxVal === minimums[j]) ||
      (i % 2 === 0 && minVal === minimums[j])
    ) break;
    curMax = Math.max(curMax, dp[j] + (curValue - minimums[j]) ** 2);
  }
  if (curMax > max) max = curMax;
  dp[i] = curMax;
}

console.log(max);
