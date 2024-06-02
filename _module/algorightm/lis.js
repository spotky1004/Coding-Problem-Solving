/**
 * @template T 
 * @param {T[]} A 
 * @param {(l: T, r: T) => boolean} cond 
 * @returns {T[]} 
*/
function lis(A, cond) {
  const dp = [0];
  const lenValues = [A[0]];
  for (let i = 1; i < A.length; i++) {
    const cur = A[i];

    let l = -1, r = lenValues.length;
    while (l + 1 < r) {
      const m = Math.floor((l + r) / 2);
      if (cond(lenValues[m], cur)) l = m;
      else r = m;
    }

    const curLen = r;
    dp.push(curLen);
    if (
      curLen >= lenValues.length ||
      cond(cur, lenValues[curLen])
    ) lenValues[curLen] = cur;
  }

  for (let i = A.length - 1; i >= 0; i--) {
    if (dp[i] !== lenValues.length - 1) continue;
    const out = [A[i]];
    let cur = A[i];
    let curLen = lenValues.length - 2;
    let j = i;
    while (curLen >= 0) {
      j--;
      if (dp[j] !== curLen || !cond(A[j], cur)) continue;
      cur = A[j];
      out.push(cur);
      curLen--;
    }
    return out.reverse();
  }
  return [];
}
