const isDev = process.platform !== "linux";
const [N, ...numbers] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
0
0
-1`
)
  .trim()
  .split("\n")
  .map(Number);

const range = 4000;
const toIndex = (n) => n + range;
const toNumber = (idx) => idx - range;

let sum = 0;
const numberCount = Array(range*2 + 1).fill(0);
let min = Infinity;
let max = -Infinity;
for (const n of numbers) {
  sum += n;
  min = Math.min(min, n);
  max = Math.max(max, n);
  numberCount[toIndex(n)]++;
}

let modes = [];
let modeCount = 0;
for (let i = 0; i < numberCount.length; i++) {
  const count = numberCount[i];
  if (modeCount > count) continue;
  if (modeCount < count) {
    modes = [toNumber(i)];
    modeCount = count;
  } else {
    modes.push(toNumber(i));
  }
}
modes.sort((a, b) => a - b)

let center = -1;
let countAcc = 0;
for (let i = 0; i < numberCount.length; i++) {
  countAcc += numberCount[i];
  if (countAcc > (N-1)/2) {
    center = toNumber(i);
    break;
  }
}

const out = [
  Math.round(sum / N),
  center,
  modes[1] ?? modes[0],
  max - min
];
console.log(out.join("\n"));
