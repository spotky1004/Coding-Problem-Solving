const isDev = process?.platform !== "linux";
const [[N], ...books] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
0 11
8 7
10 6`
// `4
// 0 10
// 10 7
// 7 2
// 2 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

books.sort(([a0, a1], [b0, b1]) => {
  if (a0 === 0) return -1;
  if (b0 === 0) return 1;
  const aDif = a1 - a0;
  const bDif = b1 - b0;
  if (aDif >= 0 && bDif >= 0) return a0 - b0;
  if (aDif >= 0) return -1;
  if (bDif >= 0) return 1;
  return bDif - aDif;
});


let happy = 0;
let possible = true;
for (const [ai, bi] of books.filter(([ai, bi]) => bi - ai >= 0)) {
  if (ai > happy) {
    possible = false;
    break;
  }
  happy += bi - ai;
}


console.log(possible ? 0 : 1);
