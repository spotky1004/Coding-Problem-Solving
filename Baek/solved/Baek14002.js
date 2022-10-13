const isDev = process.platform !== "linux";
const [, a] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
10 20 10 30 20 50
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/** @type {[len: number, beforeIdx: number][]} */
const dp = [];
/** @type {[value: number, idx: number][]} */
const minLens = [];
for (let i = 0; i < a.length; i++) {
  const value = a[i];
  const len = minLens.findIndex(v => v[0] >= value);
  if (len === -1) {
    dp.push([minLens.length, (minLens[minLens.length - 1] ?? [])[1] ?? -1]);
    minLens.push([value, i]);
  } else {
    dp.push([len - 1, (minLens[len - 1] ?? [])[1] ?? -1]);
    if (
      value !== a[len - 1] &&
      minLens[len][0] > value
    ) {
      minLens[len] = [value, i];
    }
  }
}

let out = minLens.length + "\n";
const track = [];
let before = minLens[minLens.length - 1][1];
while (before !== -1) {
  track.push(a[before]);
  before = dp[before][1];
}
out += track.reverse().join(" ");
console.log(out);
