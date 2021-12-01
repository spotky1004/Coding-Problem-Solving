// const rawInput = require('fs').readFileSync('/dev/stdin').toString();
const rawInput = `5
-1 0 0 1 1
0`;
const input = rawInput.trim().split("\n").map(e => e.trim());

const nodeCount = +input[0];
const nodeToDelete = +input[2];

let nodeParents = input[1].split(" ").map(v => +v);
const rootNode = nodeParents.findIndex(v => v === -1);
nodeParents[nodeToDelete] = -1;
if (nodeToDelete === rootNode) {
  console.log(0);
  process.exit(0);
}

/** @typedef {number[][]} NodeChilds */
/** @type {NodeChilds} */
const nodeChilds = nodeParents.reduce((acc, node, idx) => {
  if (node !== -1) acc[node].push(idx);
  return acc;
}, Array.from({length: nodeCount}, _ => []));

/**
 * @param {NodeChilds} tree 
 * @return {number}
 */
function getLeefNodeCount(tree, searchingNode) {
  const nodeChild = tree[searchingNode];
  if (nodeChild.length === 0) return 1;

  let leafNodeCount = 0;
  for (let i = 0; i < nodeChild.length; i++) {
    leafNodeCount += getLeefNodeCount(tree, nodeChild[i]);
  }

  return leafNodeCount;
}

console.log(getLeefNodeCount(nodeChilds, rootNode));
