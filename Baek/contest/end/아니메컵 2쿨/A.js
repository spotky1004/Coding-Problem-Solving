const isDev = process?.platform !== "linux";
const [[N, M], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 5
4
3
4
5 4 3 2 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const field = Array.from({ length: N }, () => Array(M).fill(true));

for (let ty = 0; ty < N; ty++) {
  const tx = 0;
  const data = datas[ty][tx];
  for (let y = 0; y < N; y++) {
    const fieldRow = field[y];
    for (let x = 0; x < M; x++) {
      const dist = Math.abs(ty - y) + Math.abs(tx - x);
      fieldRow[x] = fieldRow[x] && (dist === data);
    }
  }
}
for (let tx = 0; tx < M; tx++) {
  const ty = N - 1;
  const data = datas[ty][tx];
  for (let y = 0; y < N; y++) {
    const fieldRow = field[y];
    for (let x = 0; x < M; x++) {
      const dist = Math.abs(ty - y) + Math.abs(tx - x);
      fieldRow[x] = fieldRow[x] && (dist === data);
    }
  }
}

let avaiable = [-1, -1];
for (let y = 0; y < N; y++) {
  const fieldRow = field[y];
  for (let x = 0; x < M; x++) {
    if (fieldRow[x]) avaiable = [x+1, y+1];
  }
}

// console.table(field);
console.log(avaiable[1] + " " + avaiable[0]);
