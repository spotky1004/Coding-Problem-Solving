const isDev = process?.platform !== "linux";
const [[N, M], ...paper] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 4
1 0 0 1
1 1 2 2
0 0 1 2
0 1 1 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let brushCount = 0;
for (let i = 0; i < N; i++) {
  const row = paper[i];
  
  let prevCell = 0;
  let one = 0;
  let two = 0;

  for (let j = 0; j < M; j++) {
    const cell = row[j];

    if (cell === 1) {
      if (prevCell !== 1) one++;
    } else if (cell === 2) {
      if (prevCell !== 2) two++;
    }

    if (cell === 0 || j === M - 1) {
      if (one + two === 0) {
        
      } else if (one + two === 1) {
        brushCount++;
      } else {
        brushCount += 1 + Math.min(one, two);
      }

      one = 0;
      two = 0;
    }

    prevCell = cell;
  }
}

console.log(brushCount);
