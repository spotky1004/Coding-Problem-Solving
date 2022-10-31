const isDev = process.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`37`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

const exp = 120;
const mod = 10n**BigInt(exp);
function cutZero(x) {
  const strVal = x.toString();
  const zeroCount = (strVal.match(/0+$/) ?? [""])[0].length;
  if (zeroCount > 0) {
    x = BigInt(strVal.slice(0, -zeroCount));
  }
  return x;
}

const digitMuls = [1n, 1n, 2n, 6n, 4n, 2n, 2n, 4n, 2n, 8n];

function solve(n) {
  const nDigits = Array.from(n.toString()).reverse();
  let out = digitMuls[nDigits[0]];
  for (let i = 1; i < nDigits.length; i++) {
    const digit = nDigits[i];
    out = cutZero(out * (i === 1 ? 8n : 2n)**BigInt(digit) * BigInt(digit)) % mod;
  }
  return Number(out.toString().slice(-1));
}
const tests = [
  1,
  1, 2, 6, 4, 2, 2, 4, 2, 8, 8,
  8, 6, 8, 2, 8, 8, 6, 8, 2, 4
];
for (let i = 1; i < tests.length; i++) {
  const a = tests[i];
  const b = solve(i);
  if (a !== b) console.log(i, a, b);
}
// console.log(solve(37));
