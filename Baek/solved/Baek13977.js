const isDev = process?.platform !== "linux";
const [[N], ...cases] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
5 0
5 2
5 3
10 5
20 10
10 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number} to
 * @param {number} mod
*/
function genFactroialMod(to, mod) {
  to = BigInt(to);
  mod = BigInt(mod);
  
  const arr = [1n];
  let out = 1n;
  for (let i = 1n; i <= BigInt(to); i++) {
    out = (out*i) % mod;
    arr.push(out);
  }

  return arr;
}

/**
 * @param {number} n 
 * @param {number} r 
 * @param {number} p
 * @param {number[]} factroials
 */
function combination(n, r, p, factroials) {
  return factroials[n] * divAndPow(factroials[n - r] * factroials[r], p - 2n, p) % p;
}

/**
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @param {BigInt} p
*/
function divAndPow(a, b, p) {
  const bin = Array.from(b.toString(2)).reverse();
  let out = 1n;
  let curMul = a;
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "1") {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}

const p = 1_000_000_007n;
const factroials = genFactroialMod(4_000_000, p);

const out = [];
for (const [n, k] of cases) {
  out.push(combination(n, k, p, factroials));
}

console.log(out.join("\n"));
