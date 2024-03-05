/**
 * @param {bigint} to
 * @param {bigint} mod
*/
function genFactroialMod(to, mod) {
  const arr = [1n];
  let out = 1n;
  for (let i = 1n; i <= to; i++) {
    out = (out*i) % mod;
    arr.push(out);
  }

  return arr;
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

/**
 * @param {bigint} n 
 * @param {bigint} r 
 * @param {bigint} p
 * @param {bigint[]} factroials
*/
function combination(n, r, p, factroials) {
  if (n < r) return 0n;
  return factroials[n] * divAndPow(factroials[n - r] * factroials[r], p - 2n, p) % p;
}

/**
 * @param {bigint} mod 
*/
function genCombinationCalculator(mod) {
  const factMod = genFactroialMod(mod, mod);

  /**
   * @param {bigint} n 
   * @param {bigint} r 
   */
  return function (n, r) {
    let ans = 1n;
    let np = n, rp = r;
    while (np > 0n && rp > 0n) {
      const ni = np % mod, ri = rp % mod;
      np /= mod;
      rp /= mod;
      ans *= combination(ni, ri, mod, factMod);
    }
    return ans % mod;
  }
}
