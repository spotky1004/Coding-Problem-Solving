const isDev = process?.platform !== "linux";
const [[N, r, c]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10 512 512`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let idx = 0;
let n = 2**N, x = 0, y = 0;
while (n >= 2) {
  const halfN = n / 2;

  let plane = 0;
  if (x + halfN <= c) {
    plane += 1;
    x += halfN;
  }
  if (y + halfN <= r) {
    plane += 2;
    y += halfN;
  }

  idx += halfN**2 * plane;
  n /= 2;
}
console.log(idx);
