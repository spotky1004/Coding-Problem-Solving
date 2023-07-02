const isDev = process?.platform !== "linux";
const [[N], P] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
3 1 4 3 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let sum = 0;
let sum2 = 0;
P.sort((a, b) => a - b);
for (const p of P) {
  sum += p;
  sum2 += sum;
}
console.log(sum2);
