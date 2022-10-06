const isDev = process.platform !== "linux";
const n = Number((
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`53
`
).trim());

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
const primes = genPrimes(4_000_000);
const sums = [];
for (let i = 0; i < primes.length; i++) {
  sums.push((sums[sums.length - 1] ?? 0) + primes[i]);
}

let i = 0;
let j = 0;
let count = 0;
while (primes[j] <= n && j < sums.length) {
  const sum = sums[j] - (sums[i-1] ?? 0);
  if (sum === n) count++;
  if (sum < n) {
    j++;
  } else {
    i++;
  }
}

console.log(count);
