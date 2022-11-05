const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`RRKRR`
)
  .trim();

let left = 0;
let right = input.length - 1;
let rLeft = input.split("R").length - 1;
let maxKkrkkLen = rLeft;
let kkrkkLen = 0;
while (left <= right) {
  const leftChar = input[left];
  const rightChar = input[right];
  if (leftChar === "R") {
    rLeft--;
    left++;
  } else if (rightChar === "R") {
    rLeft--;
    right--;
  } else if (leftChar === "K" && rightChar === "K" && left !== right) {
    kkrkkLen += 2;
    left++;
    right--;
  } else if (leftChar === "K") {
    left++;
  } else if (rightChar === "K") {
    right--;
  }
  if (rLeft === 0) break;
  maxKkrkkLen = Math.max(maxKkrkkLen, kkrkkLen + rLeft);
}

console.log(maxKkrkkLen);
