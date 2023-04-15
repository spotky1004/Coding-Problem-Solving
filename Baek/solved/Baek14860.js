const isDev = process?.platform !== "linux";
const [[N, M]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`15000000 15000000`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const p = 1_000_000_007n;

/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {(number | null)[]} */
  const net = Array.from({ length: n }, (_, i) => i);
  net[0] = null;
  net[1] = null;
  for (let i = 4; i < net.length; i += 2) {
    net[i] = null;
  }
  for (let i = 3; i < net.length; i++) {
    if (net[i] === null) continue;
    for (let j = i * 3; j < net.length; j += i * 2) {
      net[j] = null;
    }
  }
  return net.filter(v => v !== null).map(v => BigInt(v));
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



const primes = genPrimes(Math.min(N, M));

let out = 1n;

for (const prime of primes) {
  let i = 1;
  let powCount = 0;
  while (true) {
    const powDiv = Number(prime)**i;
    const curPowExp = Math.floor(N / powDiv) * Math.floor(M / powDiv);
    if (curPowExp === 0) break;
    
    powCount += curPowExp;
    i++;
  }

  out = (out * divAndPow(prime, BigInt(powCount), p)) % p;
}

console.log(out.toString());
