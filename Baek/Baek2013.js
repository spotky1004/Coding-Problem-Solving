const isDev = process.platform !== "linux";
let [, ...lines] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
10.0 28.0 2.0 12.0
1.0 10.0 3.0 14.0
10 10 20.0 20.0
50 50 99 99
10 10 15 15
20 20 50 50
104 104 200 200
103 103 999 999
102 102 1004 1004
5 5 103 103`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => BigInt(Number(v) * 100) * 1000000000n));

lines = lines.map(([x1, y1, x2, y2]) => {
  if (y2 < y1) return [x2, y2, x1, y1];
  return [x1, y1, x2, y2];
});
const linesDx = lines.map(([x1, y1, x2, y2]) => (x2 - x1)*10000000n / (y2 - y1));

Math.max = (a, b) => {
  return a > b ? a : b;
}
Math.min = (a, b) => {
  return a < b ? a : b;
}

/** @type {Map<string, [y1: number, y2: number][]>} */
const mergedLines = new Map();
for (let i = 0; i < lines.length; i++) {
  const [x1, y1, x2, y2] = lines[i];
  const dx = linesDx[i];
  const x = x1 - y1*dx;
  const key = x + "_" + dx;
  const mergedLine = mergedLines.get(key);
  if (mergedLine) {
    let mergeFrom = -1;
    let mergeTo = -1;
    for (let j = 0; j < mergedLine.length; j++) {
      const [m1, m2] = mergedLine[j];
      if (mergeFrom === -1 || !isFinite(mergeFrom)) {
        if (m2 < y1) {
          mergeFrom = Infinity;
          continue;
        }
        if (y2 < m1) break;
        mergeFrom = j;
        mergeTo = j;
      } else {
        if (m1 > y2) break;
        mergeTo = j;
      }
    }
    if (isDev) {
      console.log(mergedLines, mergeFrom, mergeTo, x1, y1, x2, y2);
    }
    if (!isFinite(mergeFrom)) {
      mergedLine.push([y1, y2]);
    } else if (mergeFrom === -1) {
      mergedLine.unshift([y1, y2]);
    } else {
      const maxY = mergedLine[mergeTo][1];
      mergedLine.splice(mergeFrom + 1, mergeTo - mergeFrom);
      mergedLine[mergeFrom][0] = Math.min(mergedLine[mergeFrom][0], y1);
      mergedLine[mergeFrom][1] = Math.max(maxY, y2);
    }
  } else {
    mergedLines.set(key, [[y1, y2]]);
  }
}

if (isDev) {
  console.log(mergedLines);
}
const lineCount = [...mergedLines.values()].reduce((a, b) => a + b.length, 0);
console.log(lineCount);
