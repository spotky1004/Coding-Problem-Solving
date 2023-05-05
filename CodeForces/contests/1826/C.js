const [, ...cases] =
(require('fs').readFileSync(0)+"")
// `5
// 13 7
// `
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

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
  return net.filter(v => v !== null);
}

const primes = genPrimes(1000);

const out = [];
for (const [n, m] of cases) {
  let minFactor = n;
  for (const p of primes) {
    if (n % p === 0) {
      minFactor = p;
      break;
    }
  }

  if (
    !(
      n === 1 ||
      m === 1
    ) &&
    (
      minFactor <= m ||
      n % 2 === 0
    )
  ) out.push("NO");
  else out.push("YES");
}

console.log(out.join("\n"));
