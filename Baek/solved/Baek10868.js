const isDev = process.platform !== "linux";
const [[N], ...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10 4
75
30
100
38
50
51
52
20
81
5
1 10
3 5
6 9
8 10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const mins = [input.slice(0, N).flat()];
while (true) {
  const prev = mins[mins.length - 1];
  if (prev.length <= 1) break;
  const min = [];
  mins.push(min);
  for (let i = 0; i < prev.length; i += 2) {
    min.push(Math.min(prev[i], prev[i + 1] ?? Infinity));
  }
}

function isVaildRange(from, to) {
  const rangeLen = to - from + 1;
  const rangeBinLen = Math.log2(rangeLen);
  if (
    Number.isInteger(rangeBinLen) &&
    Number.isInteger((from - 1) / rangeLen) &&
    Number.isInteger(to / rangeLen)
  ) return true;
  return false;
}

let out = [];
for (const [a, b] of input.slice(N)) {
  const ranges = [[a, b]];
  let rangeUpdated = true;
  while (rangeUpdated) {
    rangeUpdated = false;
    for (let i = 0; i < ranges.length; i++) {
      const [from, to] = ranges[i];
      if (isVaildRange(from, to)) continue;
      rangeUpdated = true;
      for (let j = Math.floor(Math.log2(to - from + 1)); j >= 0; j--) {
        const newLen = 2**j;
        const newTo = from + newLen - 1;
        if (isVaildRange(from, newTo)) {
          ranges.splice(i, 1, [newTo + 1, to]);
          ranges.push([from, newTo]);
          break;
        }
      }
    }
  }
  
  const minVals = [];
  for (const [from, to] of ranges) {
    const len = to - from + 1;
    const level = Math.log2(len);
    const idx = to/len - 1;
    minVals.push(mins[level][idx]);
  }
  out.push(Math.min(...minVals));
}
console.log(out.join("\n"));
