const isDev = process.platform !== "linux";
const [, ...cases] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
2 3
10 10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

let out = [];
for (const [C, R] of cases) {
  let w = 0n;
  let d = 0n;
  
  // 1)
  const minCR = C >= R ? R : C;
  w += (minCR + 1n) * (2n * minCR**2n + (-3n*C + -3n*R + 1n) * minCR + 6n*C*R) / 6n;
  // 2a)
  d += C <= R + 1n ?
    (C - 1n) * C * (C - 3n*R - 2n) / -6n :
    R * (R + 1n) * (-3n*C + R + 2n) / -6n;
  // 2b)
  d += C + 1n <= R ?
    C * (C + 1n) * (C - 3n*R + 2n) / -6n :
    (R - 1n) * R * (3n*C - R + 2n) /  6n;
  // 3)
  w += C <= R ?
    (C - 1n) * C * (C - 3n*R + 1n) / -6n :
    R * (-3n*C * (R - 1n) + R**2n - 1n) / -6n;
  
  out.push(w + " " + d);
}

console.log(out.join("\n"));
