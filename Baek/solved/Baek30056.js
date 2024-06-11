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
check(`6
1 2 3 4 5 6
ABBCAC
7
1 4 6 3
3 3 5
2 4 6
3 1 6
3 6 6
3 2 5
3 1 1`,
`18
28
11
16
1`);
check(`6
2 3 2 1 1 3
AACBCB
3
2 2 5
1 1 4 3
3 1 6`,
`30`);

function gen(N, Q) {
  const X = Array.from({ length: N }, () => Math.floor(Math.random() * N / 2) + 1);
  const initX = [...X];

  const S = [
    Array(N / 3).fill("A"),
    Array(N / 3).fill("B"),
    Array(N / 3).fill("C")
  ].flat().sort((a, b) => Math.random() - 0.5);
  const aIdx = [];
  const bIdx = [];
  const cIdx = [];
  for (let i = 0; i < N; i++) {
    if (S[i] === "A") aIdx.push(i);
    if (S[i] === "B") bIdx.push(i);
    if (S[i] === "C") cIdx.push(i);
  }

  const queries = [];
  const ans = [];
  for (let i = 0; i < Q; i++) {
    const type = i !== Q - 1 ? Math.floor(Math.random() * 2) + 1 : 3;
    const [l, r] = i !== Q - 1 ? [Math.floor(Math.random() * N), Math.floor(Math.random() * N)].sort((a, b) => a - b) : [0, N - 1];
    const k = Math.floor(Math.random() * N) + 1;
    if (type === 1) {
      for (let j = l; j <= r; j++) X[j] += k;
      queries.push(`1 ${l + 1} ${r + 1} ${k}`);
    }
    if (type === 2) {
      for (let j = 0; j < cIdx.length; j++) {
        if (l > cIdx[j] || cIdx[j] > r) continue;
        X[cIdx[j]] = X[aIdx[j]] + X[bIdx[j]];
      }
      queries.push(`2 ${l + 1} ${r + 1}`);
    }
    if (type === 3) {
      let sum = 0;
      for (let j = l; j <= r; j++) sum += X[j];
      queries.push(`3 ${l + 1} ${r + 1}`);
      ans.push(sum);
    }
  }

  return [`${N}\n${initX.join(" ")}\n${S.join("")}\n${Q}\n${queries.join("\n")}`, ans.join("\n")];
}

// while (true) {
//   const [tc, ans] = gen(30, 30);
//   // console.log(tc);
//   // console.log(ans);
//   check(tc, ans);
// }

}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], X, [S], [Q], ...queries] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => !isNaN(parseInt(v)) ? Number(v) : v));

// code
/**
 * @typedef {number} LazyType
*/
/**
 * @template {any[]} T 
 * @template U 
*/
class LazySegmentTree {
  /**
   * @typedef {T} L_TreeType 
   * @typedef {LazyType[]} LazyTree
   * @typedef {T extends readonly (infer ElementType)[] ? ElementType : never} L_ElementType 
   * @typedef {(left: L_ElementType | U, right: L_ElementType | U) => L_ElementType} MergeFunc 
   * @typedef {(element: L_ElementType | U, index: number, s: number, e: number, ...params: any[]) => [newEl: L_ElementType, lazy: LazyType]} L_UpdateFunc 
   * @typedef {L_UpdateFunc[]} L_UpdateFuncs 
   * @typedef {(curLazy: LazyType | U, lazy: LazyType | U, idx: number, s: number, e: number) => L_ElementType} LazyMergeFunc 
   * @typedef {(element: L_ElementType | U, lazy: LazyType | U, index: number, s: number, e: number) => L_ElementType} LazyApplyFunc 
   */

  /** @type {number} */
  size = 0;
  /** @type {number} */
  height = 0;
  /** @type {L_TreeType} */
  tree = null;
  /** @type {LazyTree} */
  lazy = null;
  /** @type {L_ElementType} */
  defaultValue = null;
  /** @type {MergeFunc} */
  mergeFunc = null;
  /** @type {L_UpdateFuncs} */
  updateFuncs = [];
  /** @type {LazyMergeFunc} */
  lazyMergeFunc = null;
  /** @type {LazyApplyFunc} */
  lazyApplyFunc = null;

  /**
   * @typedef LazySegmentTreeOptions 
   * @property {T} values 
   * @property {U} defaultValue 
   * @property {MergeFunc} mergeFunc 
   * @property {L_UpdateFuncs} queryFuncs 
   * @property {LazyMergeFunc} lazyMergeFunc 
   * @property {LazyApplyFunc} lazyApplyFunc 
   */
  /**
   * @param {LazySegmentTreeOptions} options 
   */
  constructor(options) {
    const { values, defaultValue, mergeFunc, queryFuncs, lazyMergeFunc, lazyApplyFunc } = options;
    this.size = values.length;
    this.height = Math.ceil(Math.log2(values.length)) + 1;
    this.mergeFunc = mergeFunc;
    this.updateFuncs = queryFuncs;
    this.lazyMergeFunc = lazyMergeFunc;
    this.lazyApplyFunc = lazyApplyFunc;
    
    this.defaultValue = defaultValue;
    this.tree = Array(1 << this.height).fill(this.defaultValue);
    this.lazy = Array(1 << this.height).fill(this.defaultValue);

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
   * @param {number} idx 
   * @param {number} s 
   * @param {number} e 
   */
  updateLazy(idx, s, e) {
    const curLazy = this.lazy[idx];
    if (curLazy === this.defaultValue) return;
    this.lazy[idx] = this.defaultValue;

    this.tree[idx] = this.lazyApplyFunc(this.tree[idx], curLazy, idx, s, e);
    if (s === e) return;
    const m = ((s + e) / 2) | 0;
    const l = idx * 2;
    const r = l + 1;
    this.lazy[l] = this.lazyMergeFunc(this.lazy[l], curLazy, l, s, m);
    this.lazy[r] = this.lazyMergeFunc(this.lazy[r], curLazy, r, m + 1, e);
  }

  /**
   * @param {number} type 
   * @param {number} idx 
   * @param  {...any} params 
   */
  update(type, idx, ...params) {
    this.updateRange(type, idx, idx, ...params);
  }

  /**
   * @param {number} type 
   * @param {number} l 
   * @param {number} r 
   * @param  {...any} params 
   */
  updateRange(type, l, r, ...params) {
    this.#updateRange(type, 1, 1, 1 << (this.height - 1), l, r, params);
  }

  /**
   * @param {number} type 
   * @param {number} idx 
   * @param {number} s 
   * @param {number} e 
   * @param {number} l 
   * @param {number} r 
   * @param {any[]} params 
   */
  #updateRange(type, idx, s, e, l, r, params) {
    this.updateLazy(idx, s, e);
    if (r < s || e < l) return;

    const m = ((s + e) / 2) | 0;
    const lIdx = idx * 2;
    const rIdx = lIdx + 1;

    if (l <= s && e <= r) {
      const [newEl, lazy] = this.updateFuncs[type](this.tree[idx], idx, s, e, ...params);
      this.tree[idx] = newEl;
      if (s === e) return;
      this.lazy[lIdx] = this.lazyMergeFunc(this.lazy[lIdx], lazy, lIdx, s, m);
      this.lazy[rIdx] = this.lazyMergeFunc(this.lazy[rIdx], lazy, rIdx, m + 1, e);
      return;
    }

    this.#updateRange(type, lIdx, s, m, l, r, params);
    this.#updateRange(type, rIdx, m + 1, e, l, r, params);
    this.tree[idx] = this.mergeFunc(this.tree[lIdx], this.tree[rIdx]);
  }

  /**
   * @param {number} l 
   * @param {number} r 
   * @returns {L_ElementType} 
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
   * @returns {L_ElementType} 
   */
  #sum(idx, s, e, l, r) {
    this.updateLazy(idx, s, e);
    if (r < s || e < l) return this.defaultValue;
    if (l <= s && e <= r) return this.tree[idx];

    const m = ((s + e) / 2) | 0;
    const lSum = this.#sum(idx * 2, s, m, l, r);
    const rSum = this.#sum(idx * 2 + 1, m + 1, e, l, r);
    return this.mergeFunc(lSum, rSum);
  }
}



const TREE_SIZE = N / 3;

const alphaIdx = { A: 0, B: 1, C: 2 };
const SNums = Array.from(S).map(Si => alphaIdx[Si]);

const idxes  = [[], [], []];
const values = [[], [], []];
for (let i = 0; i < N; i++) idxes[SNums[i]].push(i + 1), values[SNums[i]].push(X[i]);
for (let i = 0; i < TREE_SIZE; i++) values[2][i] -= values[0][i] + values[1][i];

const rangePrefix  = [Array(N + 1), Array(N + 1), Array(N + 1)];
const rangePostfix = [Array(N + 1), Array(N + 1), Array(N + 1)];
for (let i = 0; i < 3; i++) {
  rangePrefix[i][0] = 0;
  for (let l = 1; l <= N; l++) rangePrefix[i][l] = rangePrefix[i][l - 1] + (SNums[l - 1] === i);
  rangePostfix[i][N] = TREE_SIZE + 1 - (SNums[N - 1] === i);
  for (let r = N - 1; r >= 0; r--) rangePostfix[i][r] = rangePostfix[i][r + 1] - (SNums[r - 1] === i);
}

const sumSegs = [
  new LazySegmentTree({
    values: values[0],
    defaultValue: 0,
    mergeFunc: (l, r) => l + r,
    lazyApplyFunc: (el, lazy, idx, s, e) => el + (e - s + 1) * lazy,
    lazyMergeFunc: (curLazy, lazy) => curLazy + lazy,
    queryFuncs: [(el, idx, s, e, k) => [el + (e - s + 1) * k, k]]
  }),
  new LazySegmentTree({
    values: values[1],
    defaultValue: 0,
    mergeFunc: (l, r) => l + r,
    lazyApplyFunc: (el, lazy, idx, s, e) => el + (e - s + 1) * lazy,
    lazyMergeFunc: (curLazy, lazy) => curLazy + lazy,
    queryFuncs: [(el, idx, s, e, k) => [el + (e - s + 1) * k, k]]
  }),
  new LazySegmentTree({
    values: values[2],
    defaultValue: 0,
    mergeFunc: (l, r) => l + r,
    lazyApplyFunc: (el, lazy, idx, s, e) => {
      if (lazy === 0) return el;
      if (lazy[0]) el = 0;
      el += (e - s + 1) * lazy[1];
      return el;
    },
    lazyMergeFunc: (curLazy, lazy) => {
      if (curLazy === 0) return lazy;
      if (lazy === 0) return curLazy;
      if (lazy[0]) return lazy;
      return [curLazy[0], curLazy[1] + lazy[1]]
    },
    queryFuncs: [(el, idx, s, e, k) => isFinite(k) ? [el + (e - s + 1) * k, [false, k]] : [0, [true, 0]]]
  })
];

function convertRange(type, l, r) {
  const cl = rangePostfix[type][l], cr = rangePrefix[type][r];
  if (cl > cr || cl > TREE_SIZE || cr === 0) return null;
  return [Math.max(1, cl), Math.min(TREE_SIZE, cr)];
}

function sumRange(type, l, r) {
  const range = convertRange(type, l, r);
  if (range === null) return 0;
  let sum = sumSegs[type].sum(range[0], range[1]);
  if (type === 2) sum += sumSegs[0].sum(range[0], range[1]) + sumSegs[1].sum(range[0], range[1]);
  return sum;
}

function updateRange(type, l, r, k) {
  const range = convertRange(type, l, r);
  if (range === null) return;
  sumSegs[type].updateRange(0, range[0], range[1], k);
  if (type !== 2) sumSegs[2].updateRange(0, range[0], range[1], -k);
}

const out = [];
for (const [type, i, j, k] of queries) {
  if (type === 1) updateRange(0, i, j, k), updateRange(1, i, j, k), updateRange(2, i, j, k);
  else if (type === 2) updateRange(2, i, j, -Infinity);
  else if (type === 3) out.push(sumRange(0, i, j) + sumRange(1, i, j) + sumRange(2, i, j));
}
if (out.some(v => v > Number.MAX_SAFE_INTEGER)) throw "!";

// output
return out.join("\n");
}
