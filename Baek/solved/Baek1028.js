const isDev = process.platform !== "linux";
const [, ...field] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 5
01100
01011
11111
01111
11111`
)
  .trim()
  .split("\n")
  .map(line => Array.from(line).map(v => Boolean(Number(v))));

const [R, C] = [field.length, field[0].length];
const genField = () => Array.from({ length: R }, _ => Array(C).fill(0));
// Diagonal /
const dp1 = genField();
// Diagonal \
const dp2 = genField();

for (let y = 0; y < R; y++) {
  const row = field[y];
  for (let x = 0; x < C; x++) {
    const tile = row[x];
    if (!tile) continue;
    dp1[y][x] = ((dp1[y - 1] ? dp1[y - 1][x + 1] : 0) ?? 0) + 1;
    dp2[y][x] = ((dp2[y - 1] ? dp2[y - 1][x - 1] : 0) ?? 0) + 1;
  }
}

let maxSize = 0;
for (let y = 0; y < R; y++) {
  for (let x = 0; x < C; x++) {
    const maxPotential = Math.min(dp1[y][x], dp2[y][x]);
    if (maxPotential < 0) continue;
    for (let i = maxPotential; i >= 1; i--) {
      if (
        0 <= y - i + 1 && y - i + 1 < R &&
        0 <= x + i - 1 && x + i - 1 < C &&
        0 <= x - i + 1 && x - i + 1 < C &&
        dp1[y][x] >= i &&
        dp2[y][x] >= i &&
        dp1[y - i + 1][x - i + 1] >= i &&
        dp2[y - i + 1][x + i - 1] >= i
      ) {
        maxSize = Math.max(maxSize, i);
        break;
      }
    }
  }
}

console.log(maxSize);
