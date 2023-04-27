const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`50`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

const p = 10007n;

/**
 * @param {number} to
 * @param {number} mod
*/
function genFactroial(to) {
  to = BigInt(to);
  
  const arr = [1n];
  let out = 1n;
  for (let i = 1n; i <= BigInt(to); i++) {
    out = out * i;
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
function combination(n, r, factroials) {
  return factroials[Number(n)] / factroials[Number(n - r)] / factroials[Number(r)];
}



const fact = genFactroial(52n);

function calcComb(totalCount, n, selectedCount) {
  if (n - 4n * selectedCount < 0n) return 0n;

  const factor = combination(totalCount, selectedCount, fact);

  let count = combination(4n * (totalCount - selectedCount), n - 4n * selectedCount, fact);
  for (let i = 1n; i <= totalCount - selectedCount; i++) {
    count -= calcComb(totalCount - selectedCount, n - 4n * selectedCount, i);
  }

  return factor * count;
}

const setCount = N / 4n;

let sum = 0n;
for (let i = 1n; i <= setCount; i++) {
  sum += calcComb(13n, N, i);
}

console.log(sum % p + "");
