const isDev = process?.platform !== "linux";
const [[Q], ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
1 2
2 3
3 4
4 5
5 6
1 6
2 4
3 8
7 12
9 21`
)
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



const primes = genPrimes(1e6 + 1);
let t = 0;
const s = [0];
for (let i = 1; i <= 500000; i++) {
  const value = i * 2 - 1;
  while (value > primes[t]) t++;
  let next = s[i - 1];
  if (primes[t] === value) next++;
  s.push(next);
}

const out = [];
for (const [L, R] of queries) {
  out.push(s[R] - s[L]);
}
console.log(out.join("\n"));
