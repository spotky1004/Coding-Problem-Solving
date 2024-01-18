/**
 * @param {number} n 
 * @param {(perm: number[]) => void} callback 
 */
function permBruteSearcher(n, callback) {
  if (n === 0) return;

  /** @type {[i: number, lp: number, rp: number][]} */
  const nodes = [[-1, null, null]];
  for (let i = 0; i < n; i++) {
    const node = [i, nodes[i], null];
    nodes[i][2] = node;
    nodes.push(node);
  }
  const root = nodes[0];
  nodes[n][2] = root;
  root[1] = nodes[n];
  
  const perm = [];
  function impl() {
    if (root[2][0] === -1) callback(perm);
    for (let node = root[2]; node[0] !== -1; node = node[2]) {
      const [i, lp, rp] = node;
      perm.push(i);
      rp[1] = lp;
      lp[2] = rp;
      impl();
      perm.pop();
      rp[1] = node;
      lp[2] = node;
    }
  }
  impl();
}
