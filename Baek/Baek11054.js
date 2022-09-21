const isDev = process.platform !== "linux";
/** @type {number[]} */
const seq = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10
10 1 3 5 7 6 3 2 1 10`
)
  .trim()
  .split("\n")[1]
  .split(" ")
  .map(Number);

let maxLen = 0;
const increaseDp = [1];
const decreaseDp = [1];
for (let i = 1; i < seq.length; i++) {
  const curNum = seq[i];
  
  const increaseMaxIdx = increaseDp.reduce((maxIdx, len, idx) => {
    const num = seq[idx];
    const available = (increaseDp[maxIdx] ?? 0) < len && num < curNum;
    return available ? idx : maxIdx;
  }, -1);
  const decreaseMaxIdx1 = increaseDp.reduce((maxIdx, len, idx) => {
    const num = seq[idx];
    const available = (increaseDp[maxIdx] ?? 0) < len && num > curNum;
    return available ? idx : maxIdx;
  }, -1);
  const decreaseMaxIdx2 = decreaseDp.reduce((maxIdx, len, idx) => {
    const num = seq[idx];
    const available = (decreaseDp[maxIdx] ?? 0) < len && num > curNum;
    return available ? idx : maxIdx;
  }, -1);

  const increaseLen = increaseMaxIdx === -1 ? 1 : increaseDp[increaseMaxIdx] + 1;
  const decreaseLen1 = decreaseMaxIdx1 === -1 ? 1 : increaseDp[decreaseMaxIdx1] + 1;
  const decreaseLen2 = decreaseMaxIdx2 === -1 ? 1 : decreaseDp[decreaseMaxIdx2] + 1;
  const decreaseLen = Math.max(decreaseLen1, decreaseLen2);
  maxLen = Math.max(increaseLen, decreaseLen, maxLen);
  increaseDp.push(increaseLen);
  decreaseDp.push(decreaseLen);
}

console.log(maxLen);
