const isDev = process.platform !== "linux";
const [[N, S], nums] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 4
1 2 3 4`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

function calcCounts(nums) {
  const avaiables = [];
  for (const num of nums) {
    for (let i = avaiables.length - 1; i >= 0; i--) {
      avaiables.push(avaiables[i] + num);
    }
    avaiables.push(num);
  }
  /** @type {Map<number, number>} */
  const counts = new Map();
  for (const num of avaiables) {
    if (counts.has(num)) {
      counts.set(num, counts.get(num) + 1);
    } else {
      counts.set(num, 1);
    }
  }
  return counts;
}

const center = Math.ceil(N / 2);
const leftCount = calcCounts(nums.slice(0, center));
if (!leftCount.has(0)) leftCount.set(0, 0);
const rightCount = calcCounts(nums.slice(center));

let caseCount = 0;
for (const [num, left] of leftCount) {
  const rightNum = S - num;
  const right = rightCount.get(rightNum) ?? 0;

  const l = left + (num === 0 ? 1 : 0);
  const r = right + (rightNum === 0 ? 1 : 0);
  caseCount += l * r - (num === 0 && rightNum === 0 ? 1 : 0);
}
console.log(caseCount);
