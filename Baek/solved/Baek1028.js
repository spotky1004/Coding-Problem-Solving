const isDev = process.platform !== "linux";
const [, ...field] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 6
111000
101111
111111`
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
    let dp1Val = 1;
    let x1 = x - 1;
    let y1 = y + 1;
    while (
      0 <= x1 && x1 < C &&
      0 <= y1 && y1 < R &&
      field[y1][x1]
    ) {
      dp1Val++;
      x1--;
      y1++;
    }
    dp1[y][x] = dp1Val;

    let dp2Val = 1;
    let x2 = x + 1;
    let y2 = y + 1;
    while (
      0 <= x2 && x2 < C &&
      0 <= y2 && y2 < R &&
      field[y2][x2]
    ) {
      dp2Val++;
      x2++;
      y2++;
    }
    dp2[y][x] = dp2Val;
  }
}

let maxSize = 0;
for (let y = 0; y < R; y++) {
  for (let x = 0; x < C; x++) {
    const maxPotential = Math.min(dp1[y][x], dp2[y][x]);
    if (maxPotential < 0) continue;
    for (let i = maxPotential; i >= 1; i--) {
      if (
        0 <= y + i - 1 && y + i - 1 < R &&
        0 <= x + i - 1 && x + i - 1 < C &&
        0 <= x - i + 1 && x - i + 1 < C &&
        dp1[y][x] >= i &&
        dp2[y][x] >= i &&
        dp1[y + i - 1][x + i - 1] >= i &&
        dp2[y + i - 1][x - i + 1] >= i
      ) {
        maxSize = Math.max(maxSize, i);
        break;
      }
    }
  }
}

console.log(maxSize);
