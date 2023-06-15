function bigSqrt(x, m) {
  let left = 0n, right = x * m;
  while (left < right) {
    const mid = (left + right) / 2n;
    const midPow = mid ** 2n;
    if (midPow > x) right = mid - 1n;
    else if (midPow < x) left = mid + 1n;
    else return mid;
  }
  return left;
}
