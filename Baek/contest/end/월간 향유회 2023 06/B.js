const isDev = process?.platform !== "linux";
let [[N, Q], s, ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 3
2 3 4
1 2
2 3
1 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const rank = Array.from({ length : N + 1 }, _ => 1);
const roots = Array.from({ length: N + 1 }, (_, i) => i);

/**
 * @param {number} a 
*/
function find(a) {
  if (roots[a] === a) return a;

  const root = find(roots[a]);
  roots[a] = root;
  return root;
}

/**
 * @param {number} a 
 * @param {number} b 
*/
function union(a, b){
  a = find(a);
  b = find(b);

  if (a === b) return;

  if (rank[a] < rank[b]) {
    roots[a] = b;
  } else {
    roots[b] = a;
    if (rank[a] === rank[b]) {
      rank[a]++;
    }
  }
}



const powers = s.map(v => [BigInt(v), 0n, BigInt(v)]);
powers.unshift(null);
const out = [];
for (let [a, b] of queries) {
  let aRoot = find(a);
  let bRoot = find(b);
  if (aRoot === bRoot) {
    out.push(powers[aRoot][1]);
    continue;
  }
  
  let aPower = powers[aRoot];
  let bPower = powers[bRoot];
  if (aPower.length < bPower.length) [aPower, bPower, a, b, aRoot, bRoot] = [bPower, aPower, b, a, bRoot, aRoot];
  const [aSum, aMul] = aPower;
  const [bSum, bMul] = bPower;
  let newSum = aSum + bSum;
  let newMul = aMul + bMul;
  for (let i = 2; i < bPower.length; i++) {
    newMul += aSum * bPower[i];
    aPower.push(bPower[i]);
  }
  aPower[0] = newSum;
  aPower[1] = newMul;

  union(a, b);
  const newRoot = find(a);
  powers[newRoot] = aPower;

  out.push(newMul);
}
console.log(out.join("\n"));
