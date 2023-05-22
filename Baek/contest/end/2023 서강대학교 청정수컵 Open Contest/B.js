const isDev = process?.platform !== "linux";
const [[N], bundles] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
8 3 6 7 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const sum = bundles.reduce((a, b) => a + b, 0);
const minOdd = bundles.filter(v => v % 2 === 1).sort((a, b) => a - b)[0];

if (sum % 2 === 0) {
  console.log(sum);
} else {
  if (typeof minOdd !== "undefined") console.log(sum - minOdd);
  else console.log(0);
}
