const isDev = process?.platform !== "linux";
const [[T], ...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
10 8 17
0 0
1 0
1 1
4 2
4 3
4 5
2 4
3 4
7 4
8 4
9 4
7 5
8 5
9 5
7 6
8 6
9 6
10 10 1
5 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const directions = [
  [-1, 0], [1, 0],
  [0, -1], [0, 1]
];

let line = 0;
const out = [];
while (line < input.length) {
  const [M, N, K] = input[line];
  line++;

  const farm = Array.from({ length: N }, _ => Array(M).fill(false));
  for (let i = 0; i < K; i++) {
    const [x, y] = input[line];
    farm[y][x] = true;
    line++;
  }

  /**
   * @param {number} x 
   * @param {number} y 
   */
  function checkOOB(x, y) {
    if (
      0 > x || x >= M ||
      0 > y || y >= N
    ) return true;
    return false;
  }

  function searchArea(x, y) {
    const queue = [[x, y]];
    for (const [x, y] of queue) {
      for (const [dx, dy] of directions) {
        const [tx, ty] = [x + dx, y + dy];
        if (checkOOB(tx, ty) || !farm[ty][tx]) continue;
        farm[ty][tx] = false;
        queue.push([tx, ty]);
      }
    }
  }

  let wormCount = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < M; x++) {
      if (!farm[y][x]) continue;
      searchArea(x, y);
      wormCount++;
    }
  }
  out.push(wormCount);
}
console.log(out.join("\n"));
