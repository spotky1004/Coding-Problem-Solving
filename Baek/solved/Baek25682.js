const isDev = process?.platform !== "linux";
const [...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10 13 10
BBBBBBBBWBWBW
BBBBBBBBBWBWB
BBBBBBBBWBWBW
BBBBBBBBBWBWB
BBBBBBBBWBWBW
BBBBBBBBBWBWB
BBBBBBBBWBWBW
BBBBBBBBBWBWB
WWWWWWWWWWBWB
WWWWWWWWWWBWB`
)
  .trim()
  .split("\n");

const [N, M, K] = lines.shift().split(" ").map(v => +v);
const board = lines.map(line => Array.from(line).map(c => c === "B" ? 1 : 0));

const suffixArrs = [];

for (let y = 0; y < N; y++) {
  const row = board[y];
  const prevSuffixArr = suffixArrs[y - 1] ?? [];
  const suffixArr = Array(M).fill(0)
  for (let x = 0; x < M; x++) {
    const cell = row[x];
    const correctCell = (x + y) % 2;
    suffixArr[x] += (prevSuffixArr[x] ?? 0) - (prevSuffixArr[x - 1] ?? 0) + (suffixArr[x - 1] ?? 0) + (cell ^ correctCell);
  }

  suffixArrs.push(suffixArr);
}

let min = Infinity;
const boardSize = K * K;
for (let y = 0; y < N - K + 1; y++) {
  for (let x = 0; x < M - K + 1; x++) {
    // asdf
    const toPaint = suffixArrs[y + K - 1][x + K - 1] - ((suffixArrs[y - 1] ?? 0)[x + K - 1] ?? 0) - (suffixArrs[y + K - 1][x - 1] ?? 0) + ((suffixArrs[y - 1] ?? [])[x - 1] ?? 0);
    min = Math.min(min, toPaint, boardSize - toPaint);
  }
}

console.log(min);
