const isDev = process.platform !== "linux";
const [, N, , M] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
2 3 3 3
3
1 4 10`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

/** @type {boolean[]} */
const dp = [];
for (const n of N) {
  const clone = dp.slice();
  for (let i = 0; i < clone.length; i++) {
    if (clone[i]) {
      dp[i + n] = true;
      dp[Math.abs(i - n)] = true;
    }
  }

  dp[n] = true;
}

let output = "";
for (const m of M) {
  output += (dp[m] ? "Y" : "N") + " ";
}
console.log(output.trim());
