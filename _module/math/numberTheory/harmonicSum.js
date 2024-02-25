/**
 * @param {number} n 
*/
function harmonicSum(n) {
  let l = 1, r, div;
  let sum = 0;
  while (l <= n) {
    div = Math.floor(n / l);
    r = Math.floor(n / div);
    sum += (r - l + 1) * div;
    l = r + 1;
  }
  return sum;
}
