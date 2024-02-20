/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} p
*/
function divAndPow(a, b, p) {
  let out = 1;
  let curMul = a;
  let bin = 1;
  while (bin <= b) {
    if (b & bin) {
      out = out*curMul % p;
    }
    bin *= 2;
    curMul = curMul**2 % p;
  }
  return out;
}

/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b, p) {
  let out = 1n;
  let curMul = a;
  let bin = 1n;
  while (bin <= b) {
    if (b & bin) {
      out = out*curMul % p;
    }
    bin *= 2n;
    curMul = curMul**2n % p;
  }
  return out;
}
