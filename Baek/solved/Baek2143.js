const isDev = process.platform !== "linux";
const [[T], , a, , b] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
1
1
10
1 1 1 1 1 1 1 1 1 1
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const aSums = [];
for (let i = 0; i < a.length; i++) {
  aSums.push((aSums[i - 1] ?? 0) + a[i]);
}
const bSums = [];
for (let i = 0; i < b.length; i++) {
  bSums.push((bSums[i - 1] ?? 0) + b[i]);
}

function getASum(from, to) {
  return aSums[to] - (aSums[from - 1] ?? 0);
}
function getBSum(from, to) {
  return bSums[to] - (bSums[from - 1] ?? 0);
}

const bSubSums = new Map();
for (let bFrom = 0; bFrom < b.length; bFrom++) {
  for (let bTo = bFrom; bTo < b.length; bTo++) {
    const bSum = getBSum(bFrom, bTo);
    bSubSums.set(bSum, (bSubSums.get(bSum) ?? 0) + 1);
  }
}

let combCount = 0;
for (let aFrom = 0; aFrom < a.length; aFrom++) {
  for (let aTo = aFrom; aTo < a.length; aTo++) {
    const aSum = getASum(aFrom, aTo);
    const diff = T - aSum;
    combCount += bSubSums.get(diff) ?? 0;
  }
}

console.log(combCount);
