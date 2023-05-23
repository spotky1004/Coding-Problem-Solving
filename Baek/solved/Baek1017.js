const isDev = process?.platform !== "linux";
const [[N], n] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
12 4 11 10 7 1`
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



const primes = genPrimes(2000);

const firstNum = n.shift();
const left = n.filter(v => v % 2 === firstNum % 2);
const right = n.filter(v => v % 2 !== firstNum % 2);

const firstConnecitons = [];
for (let i = 0; i < right.length; i++) {
  if (!primes.includes(firstNum + right[i])) continue;
  firstConnecitons.push(i);
}

const connections = Array.from({ length: left.length }, _ => []);
for (let i = 0; i < left.length; i++) {
  const a = left[i];
  for (let j = 0; j < right.length; j++) {
    const b = right[j];
    if (!primes.includes(a + b)) continue;
    connections[i].push(j);
  }
}

function search(m) {
  const occuipedBy = Array(right.length).fill(-1);
  occuipedBy[m] = -2;

  let done = Array(right.length).fill(false);
  function canMatch(idx) {
    for (const r of connections[idx]) {
      if (occuipedBy[r] === -2 || done[r]) continue;
      done[r] = true;

      if (occuipedBy[r] === -1 || canMatch(occuipedBy[r])) {
        occuipedBy[r] = idx;
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < left.length; i++) {
    if (!canMatch(i)) return false;
    done = Array(right.length).fill(false);
  }
  return occuipedBy.filter(v => v === -1).length === 0;
}

const out = [];
for (const m of firstConnecitons) {
  const result = search(m);
  if (result) out.push(right[m]);
}
out.sort((a, b) => a - b);
console.log(out.length > 0 ? out.join(" ") : "-1");
