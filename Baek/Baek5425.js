let input = "500\n";
for (let i = 0; i < 500; i++) {
  const a = Math.floor(Math.random() * 1e6);
  const b = a + Math.floor(Math.random() * 1e6);
  input += a + " " + b + "\n";
}
require("fs").writeFileSync("./stdin", input);

const isDev = process.platform !== "linux";
const [, ...tests] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
    input
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const numSums = [0n, 1n, 3n, 6n, 10n, 15n, 21n, 28n, 36n, 45n];
const digitSums = [0n, 45n];
for (let e = 2n; e <= 15n; e++) {
  const lastSum = digitSums[digitSums.length - 1];
  digitSums.push(45n*(10n**(e - 1n)) + lastSum*10n);
}

let out = "";
for (const test of tests) {
  test[0] = Math.max(0, test[0] - 1);
  const sums = [];
  for (const v of test) {
    const digits = Array.from(v.toString()).reverse().map(Number);
    let sum = 0n;
    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];
      if (i !== 0 && digit === 0) continue;
      const e = BigInt(i);
      const digitN = BigInt(digit);
      let cur = 0n;
      if (i === 0) {
        cur += numSums[digit] * (10n**e);
      } else {
        cur += (numSums[digit - 1] ?? 0n) * (10n**e);
      }
      cur += digitN * digitSums[i];
      const forntDigits = digits.slice(i + 1);
      for (let j = 0; j < forntDigits.length; j++) {
        cur += BigInt(forntDigits[j]) * (digitN + (i === 0 ? 1n : 0n)) * (10n**e);
      }
      sum += cur;
    }
    sums.push(sum);
  }
  out += (sums[1] - sums[0]) + "\n";
}
console.log(out.trim());
require("fs").writeFileSync("./stdout", out.trim());

