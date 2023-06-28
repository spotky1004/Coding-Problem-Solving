const isDev = process?.platform !== "linux";
const [[N, S]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 4`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const siblingRoadCounts = [];
for (let i = 0; i <= 50; i++) {
  siblingRoadCounts[i] = i * (i - 1) / 2;
}

const dp = Array.from({ length: N + 1 }, () => Array(S + 1).fill(false));
dp[1][0] = true;
for (let i = 1; i < N - 1; i++) {
  const roadCount = siblingRoadCounts[i];
  dp[i + 1][roadCount] = true;
}

for (let i = 2; i <= N; i++) {
  const avaiables = dp[i];
  for (let s = 0; s < avaiables.length; s++) {
    if (!avaiables[s]) continue;
    for (let j = i + 1; j <= N; j++) {
      const leafCount = j - i;
      const roadCount = s + siblingRoadCounts[leafCount] + leafCount;
      if (roadCount > S) break;
      dp[j][roadCount] = true;
    }
  }
}

console.log(dp[N][S] ? 1 : 0);
