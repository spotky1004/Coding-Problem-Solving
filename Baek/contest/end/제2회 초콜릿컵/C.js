const isDev = process?.platform !== "linux";
const [, ...N] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
1
2
3
4
5
6
7
8
18
281
8284
59045
123123123123123`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

const m = 10n**10n;
function bigSqrt(x) {
  let left = 0n, right = x;
  const xm = x * m;
  while (left <= right) {
    const mid = (left + right) / 2n;
    const midPow = mid ** 2n;
    if (midPow > xm) right = mid - 1n;
    else if (midPow < xm) left = mid + 1n;
    else return mid;
  }
  return left;
}



const out = [];
for (const [n] of N) {
  const t = (bigSqrt(((n - 1n) * m + m / 12n) * 2n / 3n) - m / 6n) / m;
  const sumt = (t * (4n + (t - 1n) * 3n)) / 2n;
  const sub = n - sumt;

  if (t + 1n > sub) {
    const lineStart = (3n * t) * (3n * t + 1n) / 2n + 1n;
    out.push(lineStart + 3n * (sub - 1n));
  } else if (2n * (t + 1n) > sub) {
    const lineStart = (3n * t + 1n) * (3n * t + 2n) / 2n + 1n;
    out.push(lineStart + 2n + 3n * (sub - t - 2n));
  } else {
    const lineStart = (3n * t + 2n) * (3n * t + 3n) / 2n + 1n;
    out.push(lineStart + 1n + 3n * (sub - 2n * (t + 1n)));
  }
}
console.log(out.join("\n"));
