const isDev = process?.platform !== "linux";
const [[n, k, x], ...players] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 1 4
0 4
1 3
3 1
2 2
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/** @typedef {`${number} ${number}`} ScoreStr */
/** @type {Map<ScoreStr, [count: number, suma: number, sumb: number, playerIdx: number]>} */
const dp = new Map();
let maxScore = 0;

for (let i = 0; i < players.length; i++) {
  const [a, b] = players[i];
  for (const [, [count, suma, sumb, playerIdx]] of dp) {
    if (playerIdx === i || count >= k) continue;
    const newSuma = suma + a;
    const newSumb = sumb + b;
    const newScore = newSuma * newSumb;
    maxScore = Math.max(maxScore, newScore);
    const newScoreStr = `${newSuma} ${newSumb}`;
    const prevCount = (dp.get(newScoreStr) ?? [])[0] ?? 99;
    if (prevCount <= count+1) continue;
    dp.set(newScoreStr, [count+1, newSuma, newSumb, i]);
  }
  dp.set(`${a} ${b}`, [1, a, b, i]);
  maxScore = Math.max(maxScore, a*b);
}

console.log(maxScore);
