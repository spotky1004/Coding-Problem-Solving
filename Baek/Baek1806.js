const isDev = process.platform !== "linux";
const [[, S], nums] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10 15
5 1 3 5 10 7 4 9 2 8`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const sums = [];
for (let i = 0; i < nums.length; i++) {
  sums.push((sums[sums.length - 1] ?? 0) + nums[i]);
}

let i = 0;
let j = 0;
let minLen = Infinity;
while (j < sums.length) {
  const sum = sums[j] - (sums[i-1] ?? 0);
  if (sum >= S) minLen = Math.min(minLen, j - i + 1);
  if (sum < S) j++;
  else i++;
}

console.log(isFinite(minLen) ? minLen : 0);
