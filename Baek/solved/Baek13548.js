const isDev = process?.platform !== "linux";
const [[N], A, [M], ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`-`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const sqrtN = Math.floor(Math.sqrt(N) / 2);
const sortedQueries = queries.map(([s, e], i) => [s - 1, e - 1, i]).sort(([as, ae], [bs, be]) => {
  const sDif = Math.floor(Math.sqrt(as / sqrtN)) - Math.floor(Math.sqrt(bs / sqrtN));
  if (sDif !== 0) return as - bs;
  return ae - be;
});
// console.log(sortedQueries);

const maxA = 110001;
const sqrtA = Math.ceil(Math.sqrt(maxA));
const countAcc = Array(maxA).fill(0);
const buckets = Array(sqrtA).fill(0);
const bucketMaxCounts = Array(maxA).fill(0);

let l = 0;
let r = -1;
const out = Array(M);
for (const [s, e, queryIdx] of sortedQueries) {
  const lSign = Math.sign(l - s);
  const rSign = Math.sign(e - r);
  const lUpdateRange = lSign === 0 ? null : lSign === 1 ? [s, l - 1] : [l, s - 1];
  const rUpdateRange = rSign === 0 ? null : rSign === 1 ? [r + 1, e] : [e + 1, r];

  // console.log(l, r, s, e, lSign, lUpdateRange, rSign, rUpdateRange);

  l = s;
  r = e;

  if (lSign !== 0) {
    const [ls, le] = lUpdateRange;
    const bucketsToUpdate = [];
    for (let i = ls; i <= le; i++) {
      const prevAcc = countAcc[A[i]];
      const newAcc = (countAcc[A[i]] += lSign);
      const bucketIdx = Math.floor(A[i] / sqrtA);
      if (newAcc === buckets[bucketIdx]) {
        bucketMaxCounts[bucketIdx]++;
      }
      if (prevAcc === buckets[bucketIdx]) {
        if (lSign === 1) {
          buckets[bucketIdx] = newAcc;
          bucketMaxCounts[bucketIdx] = 1;
        }
        else if (!bucketsToUpdate.includes(bucketIdx)) {
          if (bucketMaxCounts[bucketIdx] === 1) bucketsToUpdate.push(bucketIdx);
          else bucketMaxCounts[bucketIdx]--;
        }
      }
    }
    for (const bucketIdx of bucketsToUpdate) {
      let max = 0;
      let maxCount = 0;
      for (let i = bucketIdx * sqrtA; i < (bucketIdx + 1) * sqrtA; i++) {
        const count = countAcc[i];
        if (count < max) continue;
        if (max < count) {
          max = countAcc[i];
          maxCount = 0;
        }
        maxCount++;
      }
      buckets[bucketIdx] = max;
      bucketMaxCounts[bucketIdx] = maxCount;
    }
  }
  if (rSign !== 0) {
    const [rs, re] = rUpdateRange;
    const bucketsToUpdate = [];
    for (let i = rs; i <= re; i++) {
      const prevAcc = countAcc[A[i]];
      const newAcc = (countAcc[A[i]] += rSign);
      const bucketIdx = Math.floor(A[i] / sqrtA);
      if (newAcc === buckets[bucketIdx]) {
        bucketMaxCounts[bucketIdx]++;
      }
      if (prevAcc === buckets[bucketIdx]) {
        if (rSign === 1) {
          buckets[bucketIdx] = newAcc;
          bucketMaxCounts[bucketIdx] = 1;
        }
        else if (!bucketsToUpdate.includes(bucketIdx)) {
          if (bucketMaxCounts[bucketIdx] === 1) bucketsToUpdate.push(bucketIdx);
          else bucketMaxCounts[bucketIdx]--;
        }
      }
    }
    for (const bucketIdx of bucketsToUpdate) {
      let max = 0;
      let maxCount = 0;
      for (let i = bucketIdx * sqrtA; i < (bucketIdx + 1) * sqrtA; i++) {
        const count = countAcc[i];
        if (count < max) continue;
        if (max < count) {
          max = countAcc[i];
          maxCount = 0;
        }
        maxCount++;
      }
      buckets[bucketIdx] = max;
      bucketMaxCounts[bucketIdx] = maxCount;
    }
  }

  out[queryIdx] = Math.max(...buckets);
}
console.log(out.join("\n"));
