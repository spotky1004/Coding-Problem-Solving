const isDev = process.platform !== "linux";
const [[A, B, C]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`27020 1897 56128`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

const pi = "314159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214";
const mulExp = 60;
const mul = 10n**BigInt(mulExp);

const piMod = BigInt(pi.slice(0, mulExp + 2));
const sinDepth = 100n;
function sin(x) {
  x %= piMod;
  let val = 0n;
  for (let i = sinDepth; i > 0n; i--) {
    let newVal = (2n*i) * (2n*i + 1n) * x**2n;
    newVal /= (2n*i + 2n) * (2n*i + 3n) * mul - x**2n / mul + val;
    val = newVal;
  }
  val = (x**2n) / (2n * 3n * mul - x**2n / mul + val);
  val = (x * mul) / (mul + val);
  return val;
}
function calc(x) {
  return A*x + B*sin(x);
}

let left = 0n;
let right = (C + B) * mul / A;
let cur = (left + right) / 2n;
const sub = C * mul;
while (left < right) {
  cur = (left + right) / 2n;
  const diff = calc(cur) - sub;
  if (diff > 0n) {
    right = --cur;
  } else if (diff === 0n) {
    break;
  } else {
    left = ++cur;
  }
}
const x = Number(cur * 10000000n / mul)/1e7;
console.log((x + 5e-8).toFixed(6));
