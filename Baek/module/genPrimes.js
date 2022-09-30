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
  for (let i = 2; i < net.length; i++) {
    if (net[i] === null) continue;
    for (let j = i; j < net[i]; j += i * 2) {
      net[j] = null;
    }
  }
  return net.filter(v => v !== null);
}
