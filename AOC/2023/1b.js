const input = require("fs").readFileSync("./AOC/2023/1.in", "utf-8");
const lines = input.split("\n");

const nums = [
  null,
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine"
];

let sum = 0;
for (const line of lines) {
  let a = null;
  let b = null;
  for (let i = 0; i < line.length; i++) {
    let digit = null;

    const c = line[i];
    const s = line.slice(i, i + 5);
    for (let j = 1; j <= 9; j++) {
      if (s.startsWith(nums[j])) {
        digit = j;
        break;
      }
    }
    if (!isNaN(parseInt(c))) digit = parseInt(c);
    if (digit === null) continue;

    if (a === null) a = digit;
    b = digit;
  }

  sum += 10 * a + b;
}
console.log(sum);
