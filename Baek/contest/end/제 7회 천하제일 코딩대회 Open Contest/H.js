const isDev = process?.platform !== "linux";
const [[N], A] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
2 3 1 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

A.sort((a, b) => a - b);

let maxScore = A.reduce((a, b) => a + b, 0);
let maxSeq = [...A];
for (let i = 0; i < N; i++) {
  A.push(A.splice(N - 2, 1)[0]);

  let maxIncScore = 0;
  let maxDecScore = 0;

  let stack = [];
  let stackScore = 0;
  for (let j = 0; j < N; j++) {
    const toPush = A[j];
    while ((stack[stack.length - 1] ?? 0) > toPush) {
      stackScore -= stack.pop();
    }
    stack.push(toPush);
    stackScore += toPush;
    maxIncScore = Math.max(maxIncScore, stackScore);
  }

  stack = [];
  stackScore = 0;
  for (let j = 0; j < N; j++) {
    const toPush = A[j];
    while ((stack[stack.length - 1] ?? Infinity) < toPush) {
      stackScore -= stack.pop();
    }
    stack.push(toPush);
    stackScore += toPush;
    maxDecScore = Math.max(maxDecScore, stackScore);
  }

  const score = maxIncScore + maxDecScore;
  if (maxScore < score) {
    maxScore = score;
    maxSeq = [...A];
  }
}
console.log(`${maxScore}\n${maxSeq.join(" ")}`);
