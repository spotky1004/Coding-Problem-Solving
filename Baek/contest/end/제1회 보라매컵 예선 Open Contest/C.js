const isDev = process?.platform !== "linux";
const [[N], ...works] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
5 4
6 2
2 1
9 1
10 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

function calcWeekendCount(from, to) {
  if (from === 0) {
    return Math.floor((to + 1) / 7)*2 + Math.max(0, (to + 1)%7 - 5);
  }
  return calcWeekendCount(0, to) - calcWeekendCount(0, from - 1);
}
function calcWeekendCountRecursive(from, to) {
  const weekendCount = calcWeekendCount(from, to);
  const countAdded = weekendCount - calcWeekendCount(from, to + weekendCount); 
  if (countAdded === 0) {
    return weekendCount;
  }
  return calcWeekendCountRecursive(from, to + countAdded);
}

let possible = true;
let curDay = 0;
let extraTimeLeft = 0;
let extraTimeUsed = 0;

works.sort((a, b) => a[0] - b[0]).reverse();
while (works.length > 0) {
  const [d, t] = works.pop();
  
  let extraUse = t - (d - curDay);
  let dayAdd = t - extraUse;
  extraUse += calcWeekendCountRecursive(curDay, curDay + dayAdd);
  if (extraUse < 0) {
    dayAdd += extraUse;
    extraUse = 0;
  }
  
  curDay += Math.max(0, dayAdd);
  extraTimeLeft += dayAdd - extraUse;
  extraTimeUsed += extraUse;
  if (extraTimeLeft < 0) {
    possible = false;
    break;
  }
}

console.log(possible ? extraTimeUsed : -1);
