const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7 2 1 4 5 1 3 3
4 1000 1000 1000 1000
0`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

for (const test of input) {
  if (test[0] === 0) break;

  let maxArea = 0;
  /** @type {[number]} */
  const h = test.slice(1);

  /** @type {Map<number, number>} */
  const rectIdxMap = new Map();
  /** @type {number[]} */
  let rectHeights = [];
  /** @type {number[]} */
  let rectCounts = [];
  /** @type {number[]} */
  let rectCountSum = [];
  for (let i = 0; i < h.length; i++) {
    const height = h[i];
    let rectIdx = rectIdxMap.get(height);
    if (typeof rectIdx === "undefined") {
      rectIdx = rectHeights.findIndex(v => height < v);
      if (rectIdx === -1) {
        rectIdx = rectHeights.length;
        rectHeights.push(height);
        rectCounts.push(1);
        rectCountSum.push(1);
        for (let j = rectIdx - 1; j >= 0; j--) {
          rectCountSum[j]++;
        }
      } else {
        rectHeights.splice(rectIdx, 0, height);
        rectCounts.splice(rectIdx, 0, 1);
        rectCountSum.splice(rectIdx, 0, 1);
      }
      rectIdxMap.set(height, rectIdx);
    } else {
      rectCounts[rectIdx]++;
      for (let j = rectIdx; j >= 0; j--) {
        rectCountSum[j]++;
      }
    }
    const removed = rectHeights.splice(rectIdx + 1, Infinity);
    removed.map(v => rectIdxMap.delete(v));
    const mergedCount = rectCounts.splice(rectIdx + 1, Infinity).reduce((a, b) => a + b, 0);
    rectCounts[rectIdx] += mergedCount;
    rectCountSum = rectCountSum.slice(0, rectIdx + 1);
    
    if (isDev) {
      console.table({rectHeights, rectCounts, rectCountSum});
      console.log(Math.max(...rectHeights.map((height, idx) => height * rectCountSum[idx])), rectIdxMap, "\n----------------");
    }
    maxArea = Math.max(maxArea, ...rectHeights.map((height, idx) => height * rectCountSum[idx]));
  }

  console.log(maxArea);
}
