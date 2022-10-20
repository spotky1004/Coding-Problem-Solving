const isDev = process.platform !== "linux";
const [[N, M], ...garos] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6 5
3 2
11 10
12 18
13 19
15 15
17 19`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

function getCostSum(curPos, leftDone, rightDone, t) {
  const leftCosts = [];
  for (let i = M - 2 - leftDone; i >= 0; i--) {
    const [D, cost] = garos[i];
    leftCosts.push((curPos - D + t) * cost);
  }
  const leftCostsSum = [];
  if (leftCosts.length > 0) {
    let acc = leftCosts[0];
    leftCostsSum.push(acc);
    for (let i = 1; i < leftCosts.length; i++) {
      acc += leftCosts[i];
      leftCostsSum.push(acc);
    }
  }
  
  const rightCosts = [];
  for (let i = M - rightDone; i < garos.length; i++) {
    const [D, cost] = garos[i];
    rightCosts.push((D - curPos + t) * cost);
  }
  const rightCostsSum = [];
  if (rightCosts.length > 0) {
    let acc = rightCosts[0];
    rightCostsSum.push(acc);
    for (let i = 1; i < rightCosts.length; i++) {
      acc += rightCosts[i];
      rightCostsSum.push(acc);
    }
  }

  return [leftCostsSum, rightCostsSum]
}

let curPos = garos[M - 1][0];
let leftDone = 0;
let rightDone = 0;
while (leftDone + rightDone >= N - 1) {

}
