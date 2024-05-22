/**
 * @param {number[][]} adj 
*/
function SCC(adj) {
  adj.forEach(v => v.sort((a, b) => a - b));
  let nextId = 0;
  const ids = Array(adj.length).fill(-1);
  const isFin = Array(adj.length).fill(false);

  const stack = [];
  const out = [];
  /**
   * @param {number} u 
   */
  function impl(u) {
    const curId = nextId++;
    ids[u] = curId;
    stack.push(u);

    for (const v of adj[u]) {
      if (isFin[v] || u === v) continue;
      if (ids[v] === -1) {
        const result = impl(v);
        if (result !== -1) ids[u] = Math.min(ids[u], ids[v]);
      } else ids[u] = Math.min(ids[u], ids[v]);
    }

    if (ids[u] !== curId) return ids[u];

    const scc = [];
    out.push(scc);
    while (scc[scc.length - 1] !== u) {
      const sccNode = stack.pop();
      isFin[sccNode] = true;
      scc.push(sccNode);
    }
    scc.sort((a, b) => a - b);
  }

  for (let i = 0; i < adj.length; i++) {
    if (isFin[i]) continue;
    impl(i);
  }

  out.sort((a, b) => a[0] - b[0]);
  return out;
}
