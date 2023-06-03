/**
 * @param {number} leftCount 
 * @param {number} rightCount 
 * @param {number[][]} connections 
 * @returns 
*/
function bipartiteMatching(leftCount, rightCount, connections) {
  const occuipedBy = Array(rightCount).fill(-1);

  let done = Array(rightCount).fill(false);
  function match(idx) {
    for (const r of connections[idx]) {
      if (done[r]) continue;
      done[r] = true;

      if (occuipedBy[r] === -1 || match(occuipedBy[r])) {
        occuipedBy[r] = idx;
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < leftCount; i++) {
    done = Array(rightCount).fill(false);
    match(i);
  }
  return occuipedBy.filter(v => v !== -1).length;
}
