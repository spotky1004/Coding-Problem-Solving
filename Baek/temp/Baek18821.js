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

const primes = genPrimes(Math.ceil(Math.sqrt(1e9)));

const stateChangeInterval = [];
let t = 0;
let evenOddCount = [0, 0];
let curState = true;

for (let i = 1; i <= 1e9; i++) {
  t++;
  
  let primeCount = 0;
  let n = i;
  for (const p of primes) {
    if (n === 1) break;
    while (n % p === 0) {
      primeCount++;
      n /= p;
    }
  }
  if (n !== 1) primeCount++;
  evenOddCount[primeCount % 2 ? 0 : 1]++;
  
  let newState = evenOddCount[0] >= evenOddCount[1];
  if (newState !== curState) {
    curState = newState;
    stateChangeInterval.push((stateChangeInterval[stateChangeInterval.length - 1] ?? 0) + t);
    t = 0;
  }

  if (i % 1e5 === 0) console.log(i, stateChangeInterval, evenOddCount);
}
