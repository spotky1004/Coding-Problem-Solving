const isDev = process.platform !== "linux";
const [[N], [P]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`12
50000`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const avaiableDisMinus = [];
const avaiableDisMul = [];
if (N >= 5) avaiableDisMinus.push(500);
if (N >= 10) avaiableDisMul.push(0.9);
if (N >= 15) avaiableDisMinus.push(2000);
if (N >= 20) avaiableDisMul.push(0.75);

const avaialbePrices = [P];
for (const dis of avaiableDisMinus) {
  avaialbePrices.push(Math.max(0, P - dis));
}
for (const dis of avaiableDisMul) {
  avaialbePrices.push(Math.ceil(P * dis));
}
console.log(Math.min(...avaialbePrices));
