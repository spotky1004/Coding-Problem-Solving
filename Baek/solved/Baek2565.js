const isDev = process.platform !== "linux";
/** @type {[number, number]} */
const lines = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8
1 8
3 9
2 2
4 1
6 4
10 10
9 7
7 6`
)
  .trim()
  .split("\n")
  .slice(1)
  .map(line => line.split(" ").map(Number));

void lines.sort((a, b) => a[0] - b[0]);

let maxLen = 0;
const dp = [1];
for (let i = 1; i < lines.length; i++) {
  const [curA, curB] = lines[i];
  
  const maxIdx = dp.reduce((maxIdx, len, idx) => {
    const [a, b] = lines[idx];
    const avaiable = (dp[maxIdx] ?? 0) < len && a < curA && b < curB;
    return avaiable ? idx : maxIdx;
  }, -1);
  const len = maxIdx === -1 ? 1 : dp[maxIdx] + 1;
  maxLen = Math.max(len, maxLen);
  dp.push(len);
}

console.log(lines.length - maxLen);
