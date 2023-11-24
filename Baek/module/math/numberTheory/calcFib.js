/**
 * @template {BigInt} T 
 * @param {T[][]} a 
 * @param {T[][]} b 
 * @returns {T[][]} 
*/
function matrixMult(a, b) {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1]
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1]
    ]
  ];
}

const fibMatrix = [[1n, 1n], [1n, 0n]];
const fibMatrixPows = [fibMatrix];
for (let i = 1; i <= 64; i++) {
  const nextPow = matrixMult(fibMatrixPows[i - 1], fibMatrixPows[i - 1]);
  fibMatrixPows.push(nextPow.map(row => row.map(v => v % p)));
}
function calcFibSum(n) {
  const t = n;
  let mat = fibMatrix;
  for (let i = 0n; i < 32n; i++) {
    const bit = 1n << i;

    if ((t & bit) === 0n) continue;
    mat = matrixMult(mat, fibMatrixPows[i])
      .map(row => row.map(v => v % p));
  }

  return (mat[0][1] - 1n + p) % p;
}
