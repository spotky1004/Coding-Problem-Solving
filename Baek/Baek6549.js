const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7 2 1 4 5 1 3 3
4 1000 1000 1000 1000
0`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

/**
 * @param {number[]} arr 
 */
function genSegTree(arr) {
  
}

for (const test of input) {
  if (test.length === 1 && test[0] === 0) break;
  const powLen = Math.ceil(Math.log2(test.length));

  let numbers = test.concat(Array(2**powLen - test.length).fill(0));
  let maxArea = 0;
  for (let i = 0; i < powLen; i++) {
    const width = 2**i;
    maxArea = Math.max(maxArea, Math.max(...numbers.slice(0, 65536)), Math.max(...numbers.slice(65536)));
    const newNumbers = [];
    for (let j = 0; j < numbers.length; j += 2) {
      const a = numbers[j];
      const b = numbers[j + 1];
      newNumbers.push(Math.min(a, b) * 2);
    }
    console.log(numbers);
    numbers = newNumbers;
  }
  maxArea = Math.max(maxArea, ...numbers);

  console.log(maxArea);
}