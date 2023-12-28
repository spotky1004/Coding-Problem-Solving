const input = require("fs").readFileSync("./AOC/2023/1.in", "utf-8");
const lines = input.split("\n");

const isDigit = (x) => !isNaN(parseInt(x));
let sum = 0;
for (const line of lines) {
  let a = null;
  let b = null;
  for (const c of line) {
    if (!isDigit(c)) continue;
    const digit = parseInt(c);
    if (a === null) a = digit;
    b = digit;
  }
  sum += 10 * a + b;
}

console.log(sum);
