const isDev = process?.platform !== "linux";
const [[N], A, [M], ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
5 -6 4 -3
2
1 3 1 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

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
      this.tree[realIdx] !== this.defaultValue ? this.tree[realIdx] : null,
      ...params
    );

    for (let parentIdx = (realIdx / 2) | 0; parentIdx >= 1; parentIdx = (parentIdx / 2) | 0) {
      const leftEl = this.tree[parentIdx * 2];
      const rightEl = this.tree[parentIdx * 2 + 1];
      this.tree[parentIdx] = this.mergeFunc(
        leftEl !== this.defaultValue ? leftEl : null,
        rightEl !== this.defaultValue ? rightEl : null,
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
      lSum !== this.defaultValue ? lSum : null,
      rSum !== this.defaultValue ? rSum : null
    );
  }
}



const sumSegTree = new SegmentTree({
  values: A,
  defaultValue: 0,
  mergeFunc: (left, right) => left + right,
  queryFuncs: []
});

//* [asl,    sl, el   , ael] + [asr,    sr, er   , aer]
//* [LAl, LCl, vl, RCl, RAl] + [LAr, LCr, vr, RCr, RAr]
const maxSegTree = new SegmentTree({
  /** @type {[value: number, leftCost: number, rightCost: number, leftAdd: number, rightAdd: number, s: number, e: number, as: number, ae: number][]} */
  values: A.map((v, i) => [v, 0, 0, 0, 0, i + 1, i + 1, i + 1, i + 1]),
  defaultValue: null,
  mergeFunc: (left, right) => {
    if (right === null) return left;
    if (left === null) return right;
    const [vl, LCl, RCl, LAl, RAl, sl, el, asl, ael] = left;
    const [vr, LCr, RCr, LAr, RAr, sr, er, asr, aer] = right;

    const rMerge1 = RCl + RAl + LAr;
    const rMerge2 = rMerge1 + LCr + vr;
    const lMerge1 = LCr + LAr + RAl;
    const lMerge2 = lMerge1 + RCl + vl;
    if (
      vl + Math.max(rMerge1 + rMerge2) >
      vr + Math.max(lMerge1 + lMerge2)
    ) {
      if (rMerge1 >= 0 || rMerge2 >= 0) {
        if (rMerge2 > rMerge1) {
          return [vl + rMerge2, LCl, RCr, LAl, RAr, sl, er, asl, aer];
        } else {
          if (vr + RCr >= 0) {
            return [vl + rMerge1, LCl, LCr, LAr, vr + RCr + RAr, sl, asr, asl, aer];
          } else {
            return [vl + rMerge1, LCl, LCr + vr + RCr, LAl, RAr, sl, asr, asl, aer];
          }
        }
      }
      if (vr + RCr >= 0) {
        if (LCr + LAr + RAl >= 0) {
          return [vl, LCl, RCl, LAl, RAl + LAr + LCr + vr + RCr + RAr, sl, el, asl, aer];
        } else {
          return [vl, LCl, RCl + RAl + LAr];
        }
      }
    } else {
      
    }
  },
  queryFuncs: []
});

const leftMaxSegTree = new SegmentTree({
  /** @type {[value: number, leftCost: number][]} */
  values: A.map(v => [v, 0]),
  defaultValue: null,
  mergeFunc: (left, right) => {
    if (right === null) return left;
    if (left === null) return right;
    const [vl, Ll] = left;
    const [vr, Lr] = right;
    if (Lr + vl >= 0) return [vr + Lr + vl, Ll];
    return [vr, Lr + vl + Ll];
  },
  queryFuncs: []
});

const rightMaxSegTree = new SegmentTree({
  /** @type {[value: number, rightCost: number][]} */
  values: A.map(v => [v, 0]),
  defaultValue: null,
  mergeFunc: (left, right) => {
    if (right === null) return left;
    if (left === null) return right;
    const [vl, Rl] = left;
    const [vr, Rr] = right;
    if (Rl + vr >= 0) return [vl + Rl + vr, Rr];
    return [vl, Rl + vr + Rr];
  },
  queryFuncs: []
});

const out = [];
for (const [x1, y1, x2, y2] of queries) {
  if (y1 <= x2) {
    const sum = sumSegTree.sum(y1, x2);
    const lMax = x1 !== y1 ? leftMaxSegTree.sum(x1, y1 - 1)[0] : 0;
    const rMax = x2 !== y2 ? rightMaxSegTree.sum(x2 + 1, y2)[0] : 0;
    out.push(sum + Math.max(0, lMax) + Math.max(0, rMax));
  } else {
    const [max, , , s, e] = maxSegTree.sum(x2, y1);
    const lMax = x1 !== s ? leftMaxSegTree.sum(x1, s - 1)[0] : 0;
    const rMax = y2 !== e ? rightMaxSegTree.sum(e + 1, y2)[0] : 0;
    out.push(max + Math.max(0, lMax) + Math.max(0, rMax));
  }
}
console.log(out.join("\n"));
