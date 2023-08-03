const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2`
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

/**
 * @param {number[]} arr
*/
function prefixSum(arr) {
  if (arr.length === 0) return [];

  const sumArr = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    sumArr[i] = sumArr[i - 1] + arr[i];
  }
  return sumArr;
}

function binSearch(arr, v) {
  let left = 0, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === v) return mid;
    else if (arr[mid] < v) left = mid;
    else right = mid;
  }
  return left;
}



const primes = genPrimes(1000000);
const rests = [];
let t = 2;
for (let i = 4; i <= 1000000; i++) {
  if (primes[t] === i) {
    t++;
    continue;
  }
  rests.push(i);
}
const restsSum = prefixSum(rests);

const maxPrime = primes[binSearch(primes, N)];
let goal = maxPrime * 100003;

const seq = [maxPrime];
goal -= maxPrime;
for (let i = 1; i < N; i++) {
  const rest = restsSum[N - i - 2] ?? 0;
  const toPush = Math.min(1000001 - i, goal - rest);
  goal -= toPush;
  seq.push(toPush);
  if (goal === rest) break;
}
const restLen = N - seq.length;
for (let i = 0; i < restLen; i++) {
  seq.push(rests[i]);
}
console.log(seq.join(" "));
