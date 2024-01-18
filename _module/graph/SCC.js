function SCC(nodeAdj) {
  const V = nodeAdj.length;
  const finished = Array(V).fill(false);
  let idAcc = 0;
  const ids = Array(V).fill(-1);

  const SCC = [];
  const stack = [];

  function impl(u) {
    const id = idAcc++;
    ids[u] = id;
    stack.push(u);

    const adj = nodeAdj[u];
    for (const v of adj) {
      if (finished[v] || u === v) continue;
      if (ids[v] !== -1) {
        ids[u] = Math.min(ids[u], ids[v]);
      } else {
        const toSearch = impl(v);
        if (toSearch !== -2) {
          ids[u] = Math.min(ids[u], ids[v]);
        }
      }
    }

    if (id !== ids[u]) return ids[u];

    const newSCC = [];
    while (newSCC[newSCC.length - 1] !== u) {
      const toPush = stack.pop();

      if (typeof toPush === "undefined") break;
      finished[toPush] = true;
      newSCC.push(toPush);
    }
    newSCC.sort((a, b) => a - b);
    SCC.push(newSCC);
    return -1;
  }
  for (let i = 0; i < V; i++) {
    if (finished[i]) continue;
    impl(i);
  }

  return SCC;
}