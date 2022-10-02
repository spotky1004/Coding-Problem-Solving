// from #1021

const isDev = process.platform !== "linux";
const [, alphas, , goal] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`9
algorithm
4
aori`
)
  .trim()
  .split("\n");

let calcCount = 1;
const queue = Array.from(alphas);
const toGets = Array.from(goal);
if (toGets[0] === queue[0]) toGets.splice(0, 1);
for (const toGet of toGets) {
  const toGetIdx = queue.findIndex(v => v === toGet);
  if (toGetIdx === -1) {
    calcCount = -1;
    break;
  }
  
  if (toGetIdx === 0) {
    calcCount += queue.length;
  } else {
    queue.push(...queue.splice(0, toGetIdx));
    calcCount += toGetIdx;
  }
}

console.log(calcCount);
