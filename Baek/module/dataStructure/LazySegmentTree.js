/**
 * @template {any} T 
*/
class LazySegmentTree {
  /**
   * @typedef {(left: (null | T), right: (null | T)) => T} SumFunc 
   * @typedef {(cur: T, curLazy: T, updateValue: T, start: T, end: T)} LazyProcessFunc 
   * @typedef {(cur: T, curLazy: T, leftLazy: T, rightLazy: T, updateValue: T, start: number, end: number) => [newCur: T, newLeftLazy: T, newRightLazy: T]} LazyUpdateFunc 
   */

  /** @type {number} */
  height = 0;
  /** @type {number} */
  size = 0;
  /** @type {(null | T)[]} */
  tree = [null];
  /** @type {(null | T)[]} */
  lazy = [null];
  /** @type {SumFunc} */
  sumFunc = (left, right) => (left ?? 0) + (right ?? 0);

  /** @type {T} */
  defaultLazyValue = null;
  /** @type {LazyProcessFunc} */
  lazyProcessFunc = (cur, curLazy, updateValue, start, end) => {
    return this.sumFunc(cur, this.sumFunc(curLazy, updateValue * (end - start + 1)));
  }
  /** @type {LazyUpdateFunc} */
  lazyUpdateFunc = (cur, curLazy, leftLazy, rightLazy, updateValue, start, end) => {
    return [
      this.lazyProcessFunc(cur, curLazy, updateValue, start, end),
      this.sumFunc(leftLazy, updateValue),
      this.sumFunc(rightLazy, updateValue)
    ];
  }

  /**
   * @param {T[]} arr 
   * @param {SumFunc} sumFunc 
   * @param {T} defaultLazyValue 
   * @param {LazyFunc} lazyFunc
   */
  constructor(arr, sumFunc, defaultLazyValue, lazyFunc) {
    if (sumFunc) this.sumFunc = sumFunc;
    if (lazyFunc) this.lazyFunc = lazyFunc;

    this.height = Math.ceil(Math.log2(arr.length)) + 1;
    this.tree = Array(1 << this.height).fill(null);
    this.lazy = Array(1 << this.height).fill(null);
    this.size = arr.length;

    let tmp = 1 << (this.height - 1);
    for (let i = 0; i < arr.length; i++) {
      this.tree[i + tmp] = arr[i];
      this.lazy[i + tmp] = defaultLazyValue;
    }

    for (let d = this.height - 1; d >= 1; d--) {
      const start = 1 << (d - 1);

      for (let i = start; i < 2 * start; i++) {
        const left = this.tree[i * 2];
        const right = this.tree[i * 2 + 1];

        if (
          left === null &&
          right === null
        ) continue;

        this.tree[i] = this.sumFunc(left, right);
        this.tree[i] = defaultLazyValue;
      }
    }
  }

  /**
   * @param {number} idx 
   * @param {number} start 
   * @param {number} end 
   * @param {T} data 
   */
  #updateLazy(idx, start, end, data) {
    end = Math.min(end, this.size);

    const leftIdx = idx * 2;
    const rightIdx = idx * 2 + 1;

    const [cur, leftLazy, rightLazy] = this.lazyUpdateFunc(
      this.tree[idx], this.lazy[idx],
      this.lazy[idx * 2], this.lazy[idx * 2 + 1],
      data, start, end
    );

    this.tree[idx] = cur;
    if (
      this.lazy[leftIdx] !== null &&
      typeof this.lazy[leftIdx] !== "undefined"
    ) this.lazy[leftIdx] = leftLazy;
    if (
      this.lazy[rightIdx] !== null &&
      typeof this.lazy[rightIdx] !== "undefined"
    ) this.lazy[rightIdx] = rightLazy;
  }

  /**
   * @param {number} idx 
   * @param {T} data 
   */
  update(idx, data) {
    this.updateRange(idx, idx, data);
  }

  /**
   * @param {number} left 
   * @param {number} right 
   * @param {T} data 
   */
  updateRange(left, right, data) {
    if (left > right) [left, right] = [right, left];
    this.#updateRange(1, 1, 1 << (this.height - 1), left, right, data);
  }

  #updateRange(idx, start, end, left, right, data) {
    if (right < start || end < left) {
      return;
    }
    
    if (left <= start && end <= right) {
      this.#updateLazy(idx, start, end, data);
      return;
    } else {
      if (this.lazy[idx] !== this.defaultLazyValue) {
        this.#updateLazy(idx, start, end, data);
      }
      
      const halfLen = (end - start + 1) / 2;
      this.#updateRange(idx, start, start + halfLen - 1, left, right, data);
      this.#updateRange(idx, start + halfLen, end, left, right, data);
    }
  }
  
  /**
   * @param {number} left 
   * @param {number} right 
   */
  sum(left, right) {
    if (left > right) [left, right] = [right, left];
    return this.#sum(1, 1, 1 << (this.height - 1), left, right);
  }

  /**
   * @param {number} start 
   * @param {number} end 
   * @param {number} left 
   * @param {number} right 
   */
  #sum(idx, start, end, left, right) {
    if (right < start || end < left) {
      return null;
    }
    
    if (this.lazy[idx] !== this.defaultLazyValue) this.#updateLazy(idx, start, end, this.defaultLazyValue);
    
    if (left <= start && end <= right) {
      return this.tree[idx];
    }
    const halfLen = (end - start + 1) / 2;
    return this.sumFunc(
      this.#sum(idx * 2, start, start + halfLen - 1, left, right),
      this.#sum(idx * 2 + 1, start + halfLen, end, left, right)
    );
  }
}
