/**
 * @param {number} root 
 * @param {number[][]} adj 
 */
function initTree(root, adj) {
  /** @type {number[]} */
  const depths = Array(adj.length).fill(-1);
  /** @type {number[]} */
  const parents = Array(adj.length).fill(-1);
  /** @type {boolean[]} */
  const visited = Array(adj.length).fill(false);

  function impl(u, depth, parent) {
    depths[u] = depth;
    parents[u] = parent;
    visited[u] = true;
    for (const v of adj[u]) {
      if (visited[v]) continue;
      impl(v, depth + 1, u);
    }
  }
  impl(root, 0, -1);

  return { depths, parents, visited };
}
