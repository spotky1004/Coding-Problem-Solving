const isDev = process?.platform !== "linux";
const [[N, M]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const w = N + 1;
const h = M + 1;
const p = w * h;

const done = Array(p ** 3).fill(false);

function pointToIdx(x1, y1, x2, y2, x3, y3) {
  return (x1 + y1 * w) + p * (x2 + y2 * w) + p * p * (x3 + y3 * w);
}
function markDone(x1, y1, x2, y2, x3, y3) {
  const idx = pointToIdx(x1, y1, x2, y2, x3, y3);
  if (done.length < idx) return;
  return done[idx] = true;
}
function markPushDone(x1, y1, x2, y2, x3, y3) {
  const maxX = Math.max(x1, x2, x3);
  const maxY = Math.max(y1, y2, y3);
  for (let dx = 0; dx < w - maxX; dx++) {
    for (let dy = 0; dy < h - maxY; dy++) {
      markDone(x1 + dx, y1 + dy, x2 + dx, y2 + dy, x3 + dx, y3 + dy);
    }
  }
}
function markSwapDone(x1, y1, x2, y2, x3, y3) {
  markPushDone(x1, y1, x2, y2, x3, y3);
  markPushDone(x1, y1, x3, y3, x2, y2);
  markPushDone(x2, y2, x1, y1, x3, y3);
  markPushDone(x2, y2, x3, y3, x1, y1);
  markPushDone(x3, y3, x1, y1, x2, y2);
  markPushDone(x3, y3, x2, y2, x1, y1);
}
function markRotateDone(x1, y1, x2, y2, x3, y3) {
  markSwapDone(x1, y1, x2, y2, x3, y3);
  markSwapDone(y1, x1, y2, x2, y3, x3);
}
function markAllDone(x1, y1, x2, y2, x3, y3) {
  markRotateDone(x1, y1, x2, y2, x3, y3);

  const width = Math.max(x1, x2, x3) - Math.min(x1, x2, x3);
  const height = Math.max(y1, y2, y3) - Math.min(y1, y2, y3);
  markRotateDone(width - x1, y1, width - x2, y2, width - x3, y3);
  markRotateDone(x1, height - y1, x2, height - y2, x3, height - y3);
  markRotateDone(width - x1, height - y1, width - x2, height - y2, width - x3, height - y3);
}

let count = 0;
for (let x1 = 0; x1 < w; x1++) {
  for (let y1 = 0; y1 < h; y1++) {
    for (let x2 = x1; x2 < w; x2++) {
      for (let y2 = y1; y2 < h; y2++) {
        for (let x3 = x2; x3 < w; x3++) {
          for (let y3 = y2; y3 < h; y3++) {
            const idx = pointToIdx(x1, y1, x2, y2, x3, y3);
            if (done[idx]) continue;
            markAllDone(x1, y1, x2, y2, x3, y3);
            if (
              (x1 === x2 && y1 === y2) ||
              (x1 === x3 && y1 === y3) ||
              (x2 === x3 && y2 === y3) ||
              (x1 === x2 && x2 === x3) ||
              (y1 === y2 && y2 === y3) ||
              (y1 - y2) / (x1 - x2) === (y2 - y3) / (x2 - x3)
            ) continue;
            count++;
            console.log(x1, y1, x2, y2, x3, y3);
          }
        }
      }
    }
  }
}

const x1 = 0;
const y1 = 1;
const x2 = 2;
const y2 = 1;
const x3 = 1;
const y3 = 0;
console.log(pointToIdx(x1, y1, x2, y2, x3, y3), done.length, (x1 === x2 && y1 === y2) ||
(x1 === x3 && y1 === y3) ||
(x2 === x3 && y2 === y3) ||
(x1 === x2 && x2 === x3) ||
(y1 === y2 && y2 === y3) ||
(y1 - y2) / (x1 - x2) === (y2 - y3) / (x2 - x3));

console.log(count);
