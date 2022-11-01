const isDev = process.platform !== "linux";
const [, ...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1
ZZ
1`
)
  .trim()
  .split("\n");

const k = Number(input.pop());
const numbers = input;

const alphaGains = Array(36).fill(0n);
for (const number of numbers) {
  const parsedDigits = Array.from(number)
    .reverse()
    .map((v, i) => BigInt(parseInt(v, 36)) * 36n**BigInt(i));
  for (let i = 0; i < parsedDigits.length; i++) {
    const zGain = 35n * 36n**BigInt(i);
    const alphaInt = parseInt(number[parsedDigits.length - 1 - i], 36);
    const alphaGain = zGain - parsedDigits[i];
    alphaGains[alphaInt] += alphaGain;
  }
}
const sortedAlphaGains = alphaGains
  .map((v, i) => [i.toString(36).toUpperCase(), v])
  .sort((a, b) => Number(b[1] - a[1]));
const alphaToChange = sortedAlphaGains.slice(0, k).map(v => v[0]);
const changedNumbers = numbers
  .map(v => Array.from(v).map(c => alphaToChange.includes(c) ? "Z" : c).join(""));
const base10Numbers = changedNumbers
  .map(v => {
    return Array.from(v)
      .reverse()
      .map((v, i) => BigInt(parseInt(v, 36)) * 36n**BigInt(i))
      .reduce((a, b) => a + b, 0n);
  });

console.log(base10Numbers.reduce((a, b) => a + b, 0n).toString(36).toUpperCase());
