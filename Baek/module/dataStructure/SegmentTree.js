/**
 * @template T 
 */
class SegmentTree {
  /**
   * @typedef {T} TreeType 
   * @typedef {TreeType extends readonly (infer ElementType)[] ? ElementType : never} ElementType 
   * @typedef {(left: ElementType | null, right: ElementType | null) => ElementType} MergeFunc 
   * @typedef {(element: ElementType | null, ...params: any[]) => ElementType} UpdateFunc 
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
   * @param {T} values 
   * @param {any} defaultValue 
   * @param {MergeFunc} mergeFunc 
   * @param {UpdateFuncs} queryFuncs
   */
  constructor(values, defaultValue, mergeFunc, queryFuncs) {
    this.size = values.length;
    this.height = Math.ceil(Math.log2(values.length)) + 1;
    this.mergeFunc = mergeFunc;
    this.updateFuncs = queryFuncs;
    
    this.defaultValue = defaultValue ?? null;
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
          leftEl !== this.defaultValue ? leftEl : null,
          rightEl !== this.defaultValue ? rightEl : null
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
   * @param {number} left 
   * @param {number} right 
   * @returns {ElementType} 
   */
  sum(left, right) {
    if (left > right) [left, right] = [right, left];
    return this.#sum(1, 1, 1 << (this.height - 1), left, right);
  }

  /**
   * @param {number} idx 
   * @param {number} start 
   * @param {number} end 
   * @param {number} left 
   * @param {number} right 
   * @returns {ElementType} 
   */
  #sum(idx, start, end, left, right) {
    if (right < start || end < left) return this.defaultValue;
    if (left <= start && end <= right) return this.tree[idx];

    const mid = ((start + end) / 2) | 0;
    const leftSum = this.#sum(idx * 2, start, mid, left, right);
    const rightSum = this.#sum(idx * 2 + 1, mid + 1, end, left, right);
    return this.mergeFunc(
      leftSum !== this.defaultValue ? leftSum : null,
      rightSum !== this.defaultValue ? rightSum : null
    );
  }
}
