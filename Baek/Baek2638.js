const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8 9
0 0 0 0 0 0 0 0 0
0 0 0 1 1 0 0 0 0
0 0 0 1 1 0 1 1 0
0 0 1 1 1 1 1 1 0
0 0 1 1 1 1 1 0 0
0 0 1 1 0 1 1 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const [N, M] = input.shift();
const field = input.splice(0, N);

function checkAirIsGte(x, y, n) {
  let airCount = 0;
  const tileToCheck = [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y]
  ];
  for (const [xt, yt] of tileToCheck) {
    if (
      0 > xt || xt >= M ||
      0 > yt || yt >= N
    ) continue;
    if (field[yt][xt] === 2) airCount++;
    if (airCount >= n) return true;
  }
  return false;
}

function spreadAir() {
  let spreaded = true;
  while (spreaded) {
    spreaded = false;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < M; x++) {
        const tile = field[y][x];
        if (tile !== 0) continue;
        const canSpreaded = checkAirIsGte(x, y, 1);
        if (!canSpreaded) continue;
        field[y][x] = 2;
        spreaded = true;
      }
    }
  }
}

// Init air
// "모눈종이의 맨 가장자리에는 치즈가 놓이지 않는 것으로 가정한다."
for (let y = 0; y < N; y++) {
  field[y][0] = 2;
  field[y][M - 1] = 2;
}
for (let x = 0; x < M; x++) {
  field[0][x] = 2;
  field[N - 1][x] = 2;
}
void spreadAir();

// Simulate
/** @type {[x: number, y: number][]} */
const cheesePositions = field
  .map((row, y) => row.map((value, x) => value === 1 ? [x, y] : undefined).filter(p => p))
  .flat();

let time = 0;
while (cheesePositions.length > 0) {
  time++;
  for (let i = 0; i < cheesePositions.length; i++) {
    const [x, y] = cheesePositions[i];
    const melted = checkAirIsGte(x, y, 2);
    if (!melted) continue;
    void cheesePositions.splice(i, 1);
    field[y][x] = 0;
    i--;
  }
  spreadAir();
}

if (isDev) {
  console.table(field);
}
console.log(time);
