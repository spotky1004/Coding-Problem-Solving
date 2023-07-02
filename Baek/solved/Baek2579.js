const isDev = process?.platform !== "linux";
const [N, ...scores] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
10
20
15
25
10
20`
)
  .trim()
  .split("\n")
  .map(Number);

const dp1 = [
  scores[0]
];
const dp2 = [
  scores[0]
];
for (let i = 1; i < N; i++) {
  const curScore = scores[i];
  dp1.push(
    curScore + Math.max(
      (dp1[i - 2] ?? 0),
      (dp2[i - 2] ?? 0)
    )
  );
  dp2.push(
    curScore + scores[i - 1] + Math.max(dp1[i - 3] ?? 0, dp2[i - 3] ?? 0)
  );
}
console.log(Math.max(dp1[N - 1], dp2[N - 1]));
