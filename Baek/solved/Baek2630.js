const isDev = process?.platform !== "linux";
const [[N], ...paper] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8
1 1 0 0 0 0 1 1
1 1 0 0 0 0 1 1
0 0 0 0 1 1 0 0
0 0 0 0 1 1 0 0
1 0 0 0 1 1 1 1
0 1 0 0 1 1 1 1
0 0 1 1 1 1 1 1
0 0 1 1 1 1 1 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const counts = [0, 0];
function searchSquare(size = N, sx = 0, sy = 0) {
  const f = paper[sy][sx];
  for (let y = sy; y < sy + size; y++) {
    for (let x = sx; x < sx + size; x++) {
      if (f !== paper[y][x]) {
        searchSquare(size / 2, sx, sy);
        searchSquare(size / 2, sx + size / 2, sy);
        searchSquare(size / 2, sx, sy + size / 2);
        searchSquare(size / 2, sx + size / 2, sy + size / 2);
        return;
      }
    }
  }
  counts[f]++;
}
searchSquare();

console.log(counts.join("\n"));
