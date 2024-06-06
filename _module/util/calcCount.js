/**
 * @template T
 * @param {T[]} arr 
 * @return {[value: T, count: number][]}
 */
function calcCount(arr) {
  const counts = new Map();
  for (const v of arr) {
    if (counts.has(v)) counts.set(v, counts.get(v) + 1);
    else counts.set(v, 1);
  }
  return [...counts.entries()];
}
