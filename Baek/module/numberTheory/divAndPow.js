/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} p
*/
function divAndPow(a, b, p) {
  const bin = Array.from(b.toString(2)).reverse();
  let out = 1;
  let curMul = a;
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "1") {
      out = out*curMul % p;
    }
    curMul = curMul**2 % p;
  }
  return out;
}

/**
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @param {BigInt} p
*/
function divAndPow(a, b, p) {
  const bin = Array.from(b.toString(2)).reverse();
  let out = 1n;
  let curMul = a;
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "1") {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}
