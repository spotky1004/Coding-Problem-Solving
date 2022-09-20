const seq = `2
-2 -1`
  .split("\n")[1]
  .split(" ")
  .map(Number);

const dp = [];

for (let i = 0; i < seq.length; i++) {
  const max = dp[i-1] ?? -Infinity;
  const val = seq[i];
  dp.push(Math.max(max + val, val));
}

console.log(dp.sort((a, b) => b - a)[0]);
