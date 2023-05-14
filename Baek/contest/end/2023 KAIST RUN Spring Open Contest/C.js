const isDev = process?.platform !== "linux";
const [[n], ...parents] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
3
1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {number[]} arr
*/
function prefixSum(arr) {
  if (arr.length === 0) return [];

  const sumArr = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    sumArr[i] = sumArr[i - 1] + arr[i];
  }
  return sumArr;
}


const childs = Array.from({ length: n + 1 }, _ => []);
for (let i = 0; i < parents.length; i++) {
  const parent = parents[i];
  childs[parent].push(i + 2);
}

const depths = Array(n + 1).fill(-1);
function init(curNode = 1, depth = 1) {
  depths[curNode] = depth;
  for (const child of childs[curNode]) {
    init(child, depth + 1);
  }
}
init();

const descendantCounts = Array(n + 1).fill(0);
const depthSorted = Array.from({ length: n }, (_, i) => i + 1).sort((a, b) => depths[b] - depths[a]);
for (const idx of depthSorted) {
  if (idx === 1) continue;
  descendantCounts[parents[idx - 2]] += 1 + descendantCounts[idx];
}


console.log(prefixSum(descendantCounts.sort((a, b) => a - b)).join(" "));
