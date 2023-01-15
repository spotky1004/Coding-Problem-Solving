const isDev = process?.platform !== "linux";
const [[selected], roll] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`YYYYYYYYYYYY
4 4 4`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

/**
 * @typedef {[number, number, number]} Roll
 * @typedef {(roll: Roll) => number} JokBoCalc
 */

/** @type {(roll: Roll) => number[]} */
const calcNumCounts = (roll) => roll.reduce((a, b) => {
  a[b - 1]++;
  return a;
}, Array(6).fill(0));
/** @type {(x: number) => JokBoCalc} */
const numRoll = (x) => (roll) => x * calcNumCounts(roll)[x - 1] + x * 2;

/** @type {JokBoCalc[]} */
const jokBoFn = [
  numRoll(1),
  numRoll(2),
  numRoll(3),
  numRoll(4),
  numRoll(5),
  numRoll(6),

  (roll) => {
    const counts = calcNumCounts(roll);
    for (let i = 5; i >= 0; i--) {
      if (counts[i] >= 2) {
        return (i+1) * 4;
      }
    }
    return 0;
  },
  (roll) => {
    const counts = calcNumCounts(roll);
    const filtered = counts.filter(v => v > 0);
    if (filtered.length > 2) return 0;
    const numGot = counts.map((v, i) => [v, i + 1]).filter(v => v[0] > 0).map(v => v[1]);
    if (filtered.length === 2) {
      return numGot[1] * 3 + numGot[0] * 2;
    }
    return numGot[0] === 6 ? 6*3 + 5*2 : 6*2 + numGot[0]*3;
  },

  (roll) => {
    const counts = calcNumCounts(roll);
    if (
      counts[5] > 0 ||
      counts.filter(v => v > 1).length > 0
    ) return 0;
    return 30;
  },
  (roll) => {
    const counts = calcNumCounts(roll);
    if (
      counts[0] > 0 ||
      counts.filter(v => v > 1).length > 0
    ) return 0;
    return 30;
  },

  (roll) => calcNumCounts(roll).includes(3) ? 50 : 0,
  (roll) => 6*2 + roll.reduce((a, b) => a + +b, 0)
];

let maxScore = 0;
for (let i = 0; i < 12; i++) {
  if (selected[i] === "N") continue;
  maxScore = Math.max(maxScore, jokBoFn[i](roll));
}

console.log(maxScore);
