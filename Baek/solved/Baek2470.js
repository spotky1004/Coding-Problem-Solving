const isDev = process.platform !== "linux";
const [, sols] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
1 2 3 4 5 6`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

void sols.sort((a, b) => a - b);
let minVal = Infinity;
let minIdx = [-1, -1];
let i = 0;
let j = sols.length - 1;
while (i < j) {
  const val = Math.abs(sols[i] + sols[j]);
  if (val < minVal) {
    minVal = val;
    minIdx = [i, j];
  }

  const valI = Math.abs(sols[i + 1] + sols[j]);
  const valJ = Math.abs(sols[i] + sols[j - 1]);
  if (isNaN(valJ) || valI < valJ) i++
  else j--;
}

console.log(minIdx.map(idx => sols[idx]).join(" "));
