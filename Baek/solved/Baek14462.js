const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
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
1
2
3
4
5
6
6
5
4
3
2
1`,
`5`);
check(`6
1
2
3
4
5
6
4
5
6
1
2
3`,
`6`);
check(`1
1
1`,
`1`);
check(`2
1
2
2
1`,
`2`);
check(`7
1\n2\n3\n4\n5\n6\n7
7\n6\n5\n4\n3\n2\n1`,
`5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [N, ...mokchos] = input
  .trim()
  .split("\n")
  .map(Number);

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



const lNums = mokchos.splice(0, N);
const rNums = mokchos;

const matchs = Array.from({ length: N }, _ => []);
for (let i = 0; i < N; i++) {
  for (let j = N - 1; j >= 0; j--) {
    if (Math.abs(lNums[i] - rNums[j]) <= 4) matchs[i].push(j);
  }
}

const dpSegTree = new SegmentTree({
  defaultValue: 0,
  values: Array(N).fill(0),
  mergeFunc: (l, r) => Math.max(l, r),
  queryFuncs: [
    (el, v) => Math.max(el, v)
  ]
});
for (let i = 0; i < N; i++) {
  for (const match of matchs[i]) {
    if (match === 0) {
      dpSegTree.update(0, match + 1, 1);
      continue;
    }
    dpSegTree.update(0, match + 1, dpSegTree.sum(1, match) + 1);
  }
  // console.log(Array.from({ length: N }, (_, i) => dpSegTree.sum(i + 1, i + 1)));
}

// output
return dpSegTree.sum(1, N);
}
