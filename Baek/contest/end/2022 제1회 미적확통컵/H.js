const isDev = process?.platform !== "linux";
const [[n]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const p = 1_000_000_007n;
let c = 1n;
for (let i = 1; i < n; i++) {
  c = (c * BigInt(i)) % p;
}
c = (c * BigInt(n)) % p;
console.log(c.toString());
