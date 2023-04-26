/**
 * @param {number} to
 * @param {number} mod
*/
function factroialModArr(to, mod) {
  to = BigInt(to);
  mod = BigInt(mod);
  
  const arr = [1];
  let out = 1n;
  for (let i = 1n; i <= BigInt(to); i++) {
    out = (out*i) % mod;
    arr.push(Number(out));
  }

  return arr;
}
