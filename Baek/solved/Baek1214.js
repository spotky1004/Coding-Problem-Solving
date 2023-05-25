const isDev = process?.platform !== "linux";
const [[D, P, Q]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`287341 2345 7253`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const a = P > Q ? Q : P;
const b = P > Q ? P : Q;

let minCost = Infinity;
for (let i = Math.ceil(D / a); i >= 0; i--) {
  const curCost = a * i + b * Math.ceil((D - a * i) / b);
  const prevMinCost = minCost;
  if (minCost > curCost) minCost = curCost;
  if (minCost === D || prevMinCost === curCost) break;
}
console.log(minCost);
