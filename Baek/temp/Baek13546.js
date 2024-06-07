const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`10 7
4 2 3 1 7 4 4 2 1 7 
5
6 6
5 6
3 5
3 7
1 7`,
`0
0
0
1
6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A, [M], ...queries] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @template T 
 * @template U 
 */
class SegmentTree {
  /**
   * @typedef {T} TreeType 
   * @typedef {TreeType extends readonly (infer ElementType)[] ? ElementType : never} ElementType 
   * @typedef {(left: ElementType | U, right: ElementType | U) => ElementType} MergeFunc 
   * @typedef {(element: ElementType | U, ...params: any[]) => ElementType} UpdateFunc 
   * @typedef {UpdateFunc[]} UpdateFuncs 
   */

  /** @type {number} */
  size = 0;
  /** @type {number} */
  height = 0;
  /** @type {TreeType} */
  tree = null;
  /** @type {ElementType} */
  defaultValue = null;
  /** @type {MergeFunc} */
  mergeFunc = null;
  /** @type {UpdateFuncs} */
  updateFuncs = [];

  /**
   * @typedef SegmentTreeOptions 
   * @property {T} values 
   * @property {U} defaultValue 
   * @property {MergeFunc} mergeFunc 
   * @property {UpdateFuncs} queryFuncs
   */
  /**
   * @param {SegmentTreeOptions} options 
   */
  constructor(options) {
    const { values, queryFuncs, mergeFunc, defaultValue } = options;
    this.size = values.length;
    this.height = Math.ceil(Math.log2(values.length)) + 1;
    this.mergeFunc = mergeFunc;
    this.updateFuncs = queryFuncs;

    this.defaultValue = defaultValue;
    this.tree = Array(1 << this.height).fill(this.defaultValue);

    const leafStartIdx = 1 << (this.height - 1);
    for (let i = 0; i < values.length; i++) {
      this.tree[i + leafStartIdx] = values[i];
    }

    for (let depth = this.height - 1; depth >= 1; depth--) {
      const startIdx = 1 << (depth - 1);
      for (let i = startIdx; i < 2 * startIdx; i++) {
        const leftEl = this.tree[i * 2];
        const rightEl = this.tree[i * 2 + 1];

        if (
          leftEl === this.defaultValue &&
          rightEl === this.defaultValue
        ) continue;
        this.tree[i] = this.mergeFunc(
          leftEl !== this.defaultValue ? leftEl : defaultValue,
          rightEl !== this.defaultValue ? rightEl : defaultValue
        );
      }
    }
  }

  /**
   * @param {number} type 
   * @param {number} idx 
   * @param  {...any} params 
   */
  update(type, idx, ...params) {
    const realIdx = (1 << (this.height - 1)) + idx - 1;
    this.tree[realIdx] = this.updateFuncs[type](
      this.tree[realIdx] !== this.defaultValue ? this.tree[realIdx] : this.defaultValue,
      ...params
    );

    for (let parentIdx = (realIdx / 2) | 0; parentIdx >= 1; parentIdx = (parentIdx / 2) | 0) {
      const leftEl = this.tree[parentIdx * 2];
      const rightEl = this.tree[parentIdx * 2 + 1];
      this.tree[parentIdx] = this.mergeFunc(
        leftEl !== this.defaultValue ? leftEl : this.defaultValue,
        rightEl !== this.defaultValue ? rightEl : this.defaultValue,
      );
    }
  }

  /**
   * @param {number} l 
   * @param {number} r 
   * @returns {ElementType} 
   */
  sum(l, r) {
    if (l > r) [l, r] = [r, l];
    return this.#sum(1, 1, 1 << (this.height - 1), l, r);
  }

  /**
   * @param {number} idx 
   * @param {number} s 
   * @param {number} e 
   * @param {number} l 
   * @param {number} r 
   * @returns {ElementType} 
   */
  #sum(idx, s, e, l, r) {
    if (r < s || e < l) return this.defaultValue;
    if (l <= s && e <= r) return this.tree[idx];

    const m = ((s + e) / 2) | 0;
    const lSum = this.#sum(idx * 2, s, m, l, r);
    const rSum = this.#sum(idx * 2 + 1, m + 1, e, l, r);
    return this.mergeFunc(
      lSum !== this.defaultValue ? lSum : this.defaultValue,
      rSum !== this.defaultValue ? rSum : this.defaultValue
    );
  }
}



const idxDatas = Array.from({ length: 100001 }, () => [[0, 0], []]);
for (let i = 0; i < N; i++) idxDatas[A[i]][1].push(i);

const BUCKET_SIZE = 2000;
const sortedQueries = queries
  .map((v, i) => [i, v])
  .sort((a, b) => (Math.floor(a[1][0] / BUCKET_SIZE) - Math.floor(b[1][0] / BUCKET_SIZE)) || (a[1][1] - b[1][1]));
let l = 0, r = 0;
const maxSegTree = new SegmentTree({
  values: Array(100001).fill(0),
  defaultValue: 0,
  mergeFunc: (l, r) => Math.max(l, r),
  queryFuncs: [
    (_, p) => p
  ]
});
const lenCounts = Array(100001).fill(0);
lenCounts[0] = 100001;
const out = Array(M).fill(-1);
for (let [queryIdx, [i, j]] of sortedQueries) {
  i--;
  j--;

  while (r < j) {
    r++;
    const val = A[r];
    const [range, idxes] = idxDatas[val];
    if (idxes[range[1] + 1] <= r) {
      const prevLen = idxes[range[1]] - idxes[range[0]];
      lenCounts[prevLen]--;
      if (lenCounts[prevLen] === 0) maxSegTree.update(0, prevLen, 0);
  
      range[1]++;
      const curLen = idxes[range[1]] - idxes[range[0]];
      lenCounts[curLen]++;
      if (lenCounts[curLen] === 1) maxSegTree.update(0, curLen, curLen);
    }
  }
  while (r > j) {
    const val = A[r];
    const [range, idxes] = idxDatas[val];
    if (idxes[range[1]] >= r && range[1] !== 0) {
      const prevLen = idxes[range[1]] - idxes[range[0]];
      lenCounts[prevLen]--;
      if (lenCounts[prevLen] === 0) maxSegTree.update(0, prevLen, 0);
  
      range[1]--;
      const curLen = idxes[range[1]] - idxes[range[0]];
      lenCounts[curLen]++;
      if (lenCounts[curLen] === 1) maxSegTree.update(0, curLen, curLen);
    }
    r--;
  }
  while (l < i) {
    l++;
    const val = A[l];
    const [range, idxes] = idxDatas[val];
    if (idxes[range[0] + 1] <= l) {
      const prevLen = idxes[range[1]] - idxes[range[0]];
      lenCounts[prevLen]--;
      if (lenCounts[prevLen] === 0) maxSegTree.update(0, prevLen, 0);
      
      range[0]++;
      const curLen = idxes[range[1]] - idxes[range[0]];
      lenCounts[curLen]++;
      console.log(l, i, val, curLen);
      if (lenCounts[curLen] === 1) maxSegTree.update(0, curLen, curLen);
    }
  }
  while (l > i) {
    const val = A[l];
    const [range, idxes] = idxDatas[val];
    if (idxes[range[0]] >= l && range[0] !== 0) {
      const prevLen = idxes[range[1]] - idxes[range[0]];
      lenCounts[prevLen]--;
      if (lenCounts[prevLen] === 0) maxSegTree.update(0, prevLen, 0);
  
      range[0]--;
      const curLen = idxes[range[1]] - idxes[range[0]];
      lenCounts[curLen]++;
      if (lenCounts[curLen] === 1) maxSegTree.update(0, curLen, curLen);
    }
    l--;
  }

  console.log(l, r, lenCounts.slice(1, 10), idxDatas[4]);

  out[queryIdx] = maxSegTree.sum(1, 100001);
}


// output
return out.join("\n");
}
