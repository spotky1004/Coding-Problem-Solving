const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`32 6
27 16 30 11 6 23`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

/** @type {[number, number]} */
const [N, M] = input.shift();
/** @type {number[]} */
const toGets = input.shift();

let calcCount = 0;
const queue = Array.from({ length: N }, (_, i) => i + 1);
for (const toGet of toGets) {
  const toGetIdx = queue.findIndex(v => v === toGet);
  if (toGetIdx > queue.length/2) {
    const moveCount = queue.length - toGetIdx;
    queue.unshift(...queue.splice(toGetIdx, queue.length - toGetIdx));
    calcCount += moveCount;
  } else {
    queue.push(...queue.splice(0, toGetIdx));
    calcCount += toGetIdx;
  }
  queue.shift();
}

console.log(calcCount);
