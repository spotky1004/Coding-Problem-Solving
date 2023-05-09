const isDev = process?.platform !== "linux";
const [...cases] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];
for (const h of cases) {
  if (h.length === 1 && h[0] === 0) break;

  const n = h.shift();
  const sorted = h.map((v, i) => [v, i]).sort((a, b) => {
    const diff = b[0] - a[0];
    if (diff !== 0) return diff;
    return a[1] - b[1];
  });

  const areaStartIdx = Array(n).fill(-1);
  const areaEndIdx = Array(n);
  let maxArea = 0;
  for (const [height, idx] of sorted) {
    const leftIdx = areaStartIdx[idx - 1] ?? -1;
    const rightIdx = areaStartIdx[idx + 1] ?? -1;
    
    let area = 0;
    if (leftIdx !== -1 && rightIdx !== -1) {
      areaStartIdx[idx] = leftIdx;
      areaStartIdx[areaEndIdx[rightIdx]] = leftIdx;
      areaEndIdx[leftIdx] = areaEndIdx[rightIdx];
      
      area = height * (areaEndIdx[rightIdx] - leftIdx + 1);
    } else if (leftIdx !== -1) {
      areaStartIdx[idx] = leftIdx;
      areaEndIdx[leftIdx] = idx;
      
      area = height * (idx - leftIdx + 1);
    } else if (rightIdx !== -1) {
      areaStartIdx[idx] = idx;
      areaStartIdx[areaEndIdx[rightIdx]] = idx;
      areaEndIdx[idx] = areaEndIdx[rightIdx];
      
      area = height * (areaEndIdx[rightIdx] - idx + 1);
    } else {
      areaStartIdx[idx] = idx;
      areaEndIdx[idx] = idx;
      
      area = height;
    }
    
    maxArea = Math.max(maxArea, area);
  }

  out.push(maxArea);
}
console.log(out.join("\n"));
