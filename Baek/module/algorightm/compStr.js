/**
 * @param {string} a 
 * @param {string} b 
*/
function compStr(a, b) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] === b[i]) continue;
    return a.charCodeAt(i) - b.charCodeAt(i);
  }
  return a.length - b.length;
}
