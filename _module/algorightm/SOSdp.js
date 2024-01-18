/**
 * @param {number[]} arr 
 * @returns {number[]} 
 */
function SOSdp(arr) {
  const bitLen = Math.ceil(Math.log2(arr.length));
  const maxNum = 2**bitLen;
  
  const out = [...arr, ...Array(maxNum - arr.length).fill(0)];
  for (let i = 0; i < bitLen; i++) {
    const iMask = 1 << i;
    for (let j = 0; j < maxNum; j++) {
      if ((j & iMask) === 0) continue;
      out[j] += out[j^iMask];
    }
  }
  
  return out;
}
