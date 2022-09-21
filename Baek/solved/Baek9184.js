const input = `1 1 1
2 2 2
10 4 6
50 50 50
-1 7 18
-1 -1 -1`;

/** @type {Map<string, number>} */
const dp = new Map();

/**
 * @param {string} input
 * @returns {number}
 */
function w(input) {
  const saved = dp.get(input);
  if (saved) return saved;
  const [a, b, c] = input.split(" ").map(Number);
  /** @type {number} */
  let result;
  if (a <= 0 || b <= 0 || c <= 0) {
    result = 1;
  } else if (a > 20 || b > 20 || c > 20) {
    result = w("20 20 20");
  } else if (a < b && b < c) {
    result = w(`${a} ${b} ${c-1}`) + w(`${a} ${b-1} ${c-1}`) - w(`${a} ${b-1} ${c}`);
  } else {
    result = w(`${a-1} ${b} ${c}`) + w(`${a-1} ${b-1} ${c}`) + w(`${a-1} ${b} ${c-1}`) - w(`${a-1} ${b-1} ${c-1}`);
  }
  dp.set(input, result);
  return result;
}

const abcs = input.split("\n");
for (const abc of abcs) {
  if (abc === "-1 -1 -1") process.exit(0);
  console.log(`w(${abc.replace(/ /g, ", ")}) = ${w(abc)}`);
}
