/**
 * @template {any} T 
 * @param {T[][]} a 
 * @param {T[][]} b 
 * @returns {T[][]} 
*/
function matrixMult(a, b) {
  const rows = a.length;
  const cols = (b[0] ?? []).length;
  const t = (a[0] ?? []).length;

  const out = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < t; k++) {
        out[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return out;
}
