const isDev = process?.platform !== "linux";
const [[K, N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));


const p = 1_000_000_007n;
function fact(a, b) {
  let v = 1n;
  for (let i = a; i <= b; i++) {
    v *= i;
  }
  return v;
}

console.log(((fact(N, N + K) / fact(1n, K + 1n)) % p) + "");
