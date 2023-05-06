const isDev = process?.platform !== "linux";
const [[N], ...flowerDatas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 1 3 1
3 1 6 1
6 1 11 30`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number[]} arr
*/
function prefixSum(arr) {
  if (arr.length === 0) return [];

  const sumArr = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    sumArr[i] = sumArr[i - 1] + arr[i];
  }
  return sumArr;
}

const monthDays = [
  31, 28, 31, 30,
  31, 30, 31, 31,
  30, 31, 30, 31
];
const monthAcc = [0, ...prefixSum(monthDays)];
function monthDaysToDays(m, d) {
  return monthAcc[m - 1] + (d - 1);
}

const flowers = [];
for (const [sm, sd, em, ed] of flowerDatas) {
  flowers.push([
    monthDaysToDays(sm, sd),
    monthDaysToDays(em, ed)
  ]);
}
flowers.sort((a, b) => a[0] - b[0]);

const startDay = monthDaysToDays(3, 1);
const endDay = monthDaysToDays(12, 1);

let curDay = startDay;
let flowerCount = 0;
let maxDay = -1;
for (let i = 0; i < N; i++) {
  const [sd, ed] = flowers[i];

  if (curDay >= endDay) break;
  if (sd > curDay) {
    curDay = maxDay;
    maxDay = -1;
    flowerCount++;
  }
  if (sd <= curDay) {
    maxDay = Math.max(maxDay, ed);
  }
}

if (curDay < endDay) {
  curDay = Math.max(curDay, maxDay);
  flowerCount++;
}

if (curDay < endDay) {
  console.log(0);
} else {
  console.log(flowerCount);
}
