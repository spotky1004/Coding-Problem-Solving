const isDev = process?.platform !== "linux";
const [[N], soliders] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
1 4 3 5 6 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

soliders.sort((a, b) => a - b);

let sum = soliders[soliders.length - 1];

let i = 0;
let j = soliders.length - 2;
while (i < j) {
  sum += soliders[j] - soliders[i];
  i++;
  j--;
}

console.log(sum);
