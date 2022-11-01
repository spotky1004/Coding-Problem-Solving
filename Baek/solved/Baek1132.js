const isDev = process.platform !== "linux";
const [, ...numbers] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
ABCDEFGHIJ
J
`
)
  .trim()
  .split("\n");

const notZeroAlpha = new Set(numbers.map(v => v[0]));
const alphaGains = Array(10).fill(0n);
for (const number of numbers) {
  for (let i = 0; i < number.length; i++) {
    const maxGain = 9n * 10n**BigInt(i);
    const alphaInt = parseInt(number[number.length - 1 - i], 26) - 10;
    alphaGains[alphaInt] += maxGain;
  }
}
const sortedAlphaGains = alphaGains
  .map((v, i) => [(i + 10).toString(36).toUpperCase(), v])
  .sort((a, b) => Number(b[1] - a[1]));
const alphaOrder = sortedAlphaGains.map(v => v[0]).reverse();
let changedOrder = 0;
while (notZeroAlpha.has(alphaOrder[0])) {
  const [a, b] = [changedOrder + 1, 0];
  [alphaOrder[a], alphaOrder[b]] = [alphaOrder[b], alphaOrder[a]];
  changedOrder++;
}
const changedNumbers = numbers
  .map(v => Array.from(v).map(c => alphaOrder.findIndex(v => v === c)).join(""));

console.log(changedNumbers.reduce((a, b) => a + BigInt(b), 0n).toString());