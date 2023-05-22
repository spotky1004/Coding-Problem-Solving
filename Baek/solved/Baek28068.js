const isDev = process?.platform !== "linux";
const [[N], ...books] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
0 10
10 7
7 2
2 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

function tryRead() {
  let happy = 0;
  let bookLeft = N;
  for (let i = 0; i < N; i++) {
    const [ai, bi] = books[i];
    if (ai > happy) break;
    happy += bi - ai;
    bookLeft--;
  }
  return bookLeft === 0;
}

let possible = false;

books.sort(([a0, a1], [b0, b1]) => {
  if (a0 === 0) return -1;
  if (b0 === 0) return 1;
  const aDif = a1 - a0;
  const bDif = b1 - b0;
  if (aDif >= 0 && bDif >= 0) return a0 - b0;
  if (aDif >= 0) return -1;
  if (bDif >= 0) return 1;
  return b0 - a0;
});
if (tryRead()) possible = true;

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
if (tryRead()) possible = true;

console.log(possible ? 1 : 0);
