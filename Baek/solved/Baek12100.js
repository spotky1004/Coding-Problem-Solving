const isDev = process.platform !== "linux";
const [[N], ...board] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
2 2 2
4 4 4
8 8 8
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const directions = [
  [-1, 0], [1, 0],
  [0, -1], [0, 1]
];
function search(board, direction, depth) {
  let clone = [...board.map(row => row.map(tile => [tile, tile === 0 ? true : false]))];
  const [dx, dy] = directions[direction];
  let isVaildMove = false;
  let moving = true;
  while (moving) {
    moving = false;
    for (let y = dy === 1 ? N - 1 : 0; 0 <= y && y < N; y += dy === 1 ? -1 : 1) {
      for (let x = dx === 1 ? N - 1 : 0; 0 <= x && x < N; x += dx === 1 ? -1 : 1) {
        const tx = x + dx;
        const ty = y + dy;
        if (
          0 > tx || tx >= N ||
          0 > ty || ty >= N
        ) continue;
        const tile = clone[y][x];
        if (tile[0] === 0) continue;
        const nextTile = clone[ty][tx];
        if (nextTile[0] === 0) {
          clone[ty][tx] = tile;
          clone[y][x] = [0, true];
          moving = true;
          isVaildMove = true;
        } else if (nextTile[0] === tile[0] && !tile[1] && !nextTile[1]) {
          tile[0] *= 2;
          tile[1] = true;
          clone[ty][tx] = [0, true];
          moving = true;
          isVaildMove = true;
        }
      }
    }
  }

  clone = clone.map(row => row.map(tile => tile[0]));

  if (depth >= 4 || !isVaildMove) {
    return Math.max(...clone.flat());
  } else {
    return Math.max(...[0, 1, 2, 3].map(v => search(clone, v, depth + 1)));
  }
}

console.log(Math.max(...[0, 1, 2, 3].map(v => search(board, v, 0))));
