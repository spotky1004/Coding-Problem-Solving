const isDev = process?.platform !== "linux";
const [[N, M], ...board] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8 5
0 1 2 0 0
0 0 0 0 0
0 0 1 0 0
0 0 0 0 0
0 1 0 0 0
0 0 0 0 0
0 0 1 0 0
0 0 0 1 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const ballPos = [0, 0];
ballSearch: for (let y = 0; y < N; y++) {
  for (let x = 0; x < M; x++) {
    if (board[y][x] === 2) {
      ballPos[0] = x;
      ballPos[1] = y;
      break ballSearch;
    }
  }
}

function needRestart(x, y) {
  const cur = board[y] ?? [];
  const down = board[y + 1] ?? [];

  return down[x] === 1 && (
    cur[x + 1] === 1 ||
    cur[x - 1] === 1 ||
    down[x + 1] === 1 ||
    down[x - 1] === 1
  );
}

let probabilities = Array(M).fill(0n);
probabilities[ballPos[0]] = 1n;

for (let y = ballPos[1]; y < N; y++) {
  const newProbabilities = Array(M).fill(0n);
  for (let x = 0; x < M; x++) {
    if (needRestart(x, y)) continue;

    const curP = probabilities[x];
    if ((board[y + 1] ?? [])[x] === 1) {
      newProbabilities[x - 1] += curP;
      newProbabilities[x + 1] += curP;
    } else {
      newProbabilities[x] += curP * 2n;
    }
  }

  probabilities = newProbabilities;
}

function max(arr) {
  let m = arr[0];
  for (const v of arr) {
    if (m > v) continue;
    m = v;
  }
  return m;
}

console.log(probabilities);
if (probabilities.every(v => v === 0n)) {
  console.log(-1);
} else {
  const maxP = max(probabilities);
  console.log(probabilities.findIndex(v => v === maxP));
}
