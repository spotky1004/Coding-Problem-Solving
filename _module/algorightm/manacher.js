/**
 * @param {string | any[]} str 
 */
function manacher(str) {
  const A = [];
  let r = 0, p = 0;
  for (let i = 0; i < str.length; i++) {
    if (i >= r) A[i] = 0;
    else A[i] = Math.min(r - i - 1, A[2 * p - i - 1]);
    while (str[i - A[i] - 1] === str[i + A[i] + 1]) A[i]++;
    const newR = i + A[i] + 1;
    if (r < newR) continue;
    r = newR, p = i;
  }
  return A;
}
