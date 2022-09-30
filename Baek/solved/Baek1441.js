const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 579000 987654
1 2
`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

/**
 * @param {number} a 
 * @param {number} b 
 */
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}
/**
 * @param  {...number} n 
 */
function lcm(...n) {
  if (n.length === 1) return n[0];
  let v = (n[0] * n[1]) / gcd(n[0], n[1]);
  for (let i = 2; i < n.length; i++) {
    v = (v * n[i]) / gcd(v, n[i]);
  }
  return v;
}

/**
 * @param {number} n 
 */
function binComb(n) {
  let combs = ["0", "1"];
  for (let i = 1; i < n; i++) {
    combs = ["0", "1"].map(b => combs.map(c => c + b)).flat();
  }
  return combs;
}


/** @type {[number, number, number]} */
const [N, L, R] = input.shift();
/** @type {number[]} */
const A = input.shift();

const lcms = binComb(N).slice(1).map(bin => {
  let n = [];
  for (let i = 0; i < N; i++) {
    if (bin[i] === "1") n.push(A[i]);
  }
  return lcm(...n) * (n.length%2 === 0 ? -1 : 1);
});

/**
 * @param {number} from 
 * @param {number} to 
 * @returns {number}
 */
function nanuuhjilgga(from, to) {
  if (from !== 1) return nanuuhjilgga(1, to) - nanuuhjilgga(1, from - 1);
  let sum = 0;
  for (let i = 0; i < lcms.length; i++) {
    const v = lcms[i];
    sum += Math.floor(to / Math.abs(v)) * Math.sign(v);
  }
  return sum;
}

console.log(nanuuhjilgga(L, R));
