const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
5
1 2 1
2 3 2
2 4 1
3 5 1
4 5 3
1 5`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const N = input.shift()[0];
const M = input.shift()[0];
/** @type {Map<number, number>[]} */
const nodes = Array.from({ length: N+1 }, _ => new Map());
for (const nodeData of input.splice(0, M)) {
  const [from, to, cost] = nodeData;
  nodes[from].set(to, cost);
}
/** @type {[number, number]} */
const [startCity, endCity] = input.shift();

let minimumCost = Infinity;
/**
 * @param {number} curNode 
 * @param {number} curCost 
 * @param {number[]} visited 
 */
function search(curNode, curCost) {
  if (curCost > minimumCost) return;
  const node = nodes[curNode];
  for (const [to, cost] of node) {
    node.delete(to);
    if (to === endCity) {
      minimumCost = Math.min(minimumCost, curCost + cost);
    } else {
      search(to, curCost + cost);
    }
  }
}
search(startCity, 0);

console.log(minimumCost);
