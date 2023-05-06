const isDev = process?.platform !== "linux";
const [[N], h] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
1 3 2 5 8 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let count = 0;

let prevH = 0;
for (let i = 0; i < N; i++) {
  const curH = h[i];
  if (prevH <= curH) {
    count++;
  }
  prevH = curH;
}

console.log(count);
