const isDev = process?.platform !== "linux";
const [[T, N, D], ...rawMaps] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1 8 100000000
24
1 2 1
1 8 1
2 1 1
2 3 1
2 8 1
3 2 1
3 4 1
3 7 1
3 8 1
4 3 1
4 5 1
4 7 1
5 4 1
5 6 1
6 5 1
6 7 1
7 3 1
7 4 1
7 6 1
7 8 1
8 1 1
8 2 1
8 3 1
8 7 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @template {any} T 
 * @param {T[][]} a 
 * @param {T[][]} b 
 * @returns {T[][]} 
*/
function matrixMult(a, b, p) {
  const rows = a.length;
  const cols = (b[0] ?? []).length;
  const t = (a[0] ?? []).length;

  const out = Array.from({ length: rows }, () => Array(cols).fill(0n));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < t; k++) {
        out[i][j] = (out[i][j] + a[i][k] * b[k][j]) % p;
      }
    }
  }

  return out;
}



const p = 1_000_000_007n;

const maps = [];
while (rawMaps.length > 0) {
  maps.push(
    rawMaps
      .splice(0, rawMaps.shift()[0])
  );
}

const mapMatrixes = [];
for (const map of maps) {
  const m = Array.from({ length: N }, _ => Array(N).fill(0n));
  for (const [a, b, c] of map) {
    m[a - 1][b - 1] = BigInt(c);
  }
  mapMatrixes.push(m);
}

const initialState = Array.from({ length: N }, _ => Array(N).fill(0n));
for (let i = 0; i < N; i++) {
  initialState[i][i] = 1n;
}

const maxPowCount = Math.ceil(Math.log2(D / T));
const statePows = [];
statePows.push(mapMatrixes.reduce((a, b) => matrixMult(a, b, p), initialState));
for (let i = 1; i <= maxPowCount; i++) {
  const prevPow = statePows[i - 1];
  statePows.push(matrixMult(prevPow, prevPow, p));
}

let out = initialState;
const loopCount = Math.floor(D / T);
for (let i = 0; i <= maxPowCount; i++) {
  const mask = 1 << i;
  if ((loopCount & mask) === 0) continue;
  out = matrixMult(out, statePows[i], p);
}
for (let i = 0; i < D % T; i++) {
  out = matrixMult(out, mapMatrixes[i], p);
}

console.log(out.map(v => v.join(" ")).join("\n"));
