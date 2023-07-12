const isDev = process?.platform !== "linux";
const [[N, M], ...board] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 5
1 2 3 4 5
5 4 3 2 1
2 3 4 5 6
6 5 4 3 2
1 2 1 2 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const pieces = [
  [
    [1, 1, 1, 1]
  ],
  [
    [1],
    [1],
    [1],
    [1]
  ],
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ],
  [
    [1, 1, 1],
    [1, 0, 0]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
  [
    [1, 1],
    [0, 1],
    [0, 1]
  ],
  [
    [1, 1],
    [1, 0],
    [1, 0]
  ],
  [
    [1, 1, 1],
    [0, 0, 1]
  ],
  [
    [0, 0, 1],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [0, 1],
    [1, 1],
    [1, 0]
  ],
  [
    [1, 0],
    [1, 1],
    [0, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [1, 0],
    [1, 1],
    [1, 0]
  ],
  [
    [0, 1],
    [1, 1],
    [0, 1]
  ],
];

let maxScore = 0;
for (const piece of pieces) {
  const [W, H] = [piece[0].length, piece.length];
  for (let sy = 0; sy < N - H + 1; sy++) {
    for (let sx = 0; sx < M - W + 1; sx++) {
      let score = 0;
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          score += piece[py][px] * board[sy + py][sx + px];
        }
      }
      maxScore = Math.max(maxScore, score);
    }
  }
}
console.log(maxScore);
