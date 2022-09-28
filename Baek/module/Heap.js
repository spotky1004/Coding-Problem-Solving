class Heap {
  /**
   * @typedef {(a: number, b: number) => boolean} CompareFn
   */
  
  /** @type {CompareFn} */
  compareFn = (a, b) => b - a;
  /** @type {number[]} */
  arr = [-1];
  /** @type {number} */
  size = 0;


  /**
   * @param {CompareFn} compareFn 
   */
  constructor(compareFn = (a, b) => b - a) {
    this.compareFn = compareFn;
  }

  /**
   * @param {number} value 
   */
  insert(value) {
    const size = ++this.size;
    const arr = this.arr;
    const compareFn = this.compareFn;
    arr.push(value);
    for (let i = size; i > 1; i = i >> 1) {
      const [cur, parent] = [arr[i], arr[i >> 1]];
      const compare = compareFn(cur, parent);
      if (compare >= 0) break;
      this.swap(i, i >> 1);
    }
  }

  /**
   * @param {number} i1 
   * @param {number} i2 
   */
  swap(i1, i2) {
    const arr = this.arr;
    [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
  }

  /**
   * @returns {number | undefined}
   */
  delete() {
    if (this.size === 0) return undefined;
    const arr = this.arr;
    if (this.size === 1) {
      this.size--;
      return arr.pop();
    }
    const size = --this.size;

    const compareFn = this.compareFn;
    const returnVal = arr[1];
    arr[1] = arr.pop();
    let curIdx = 1;
    while (curIdx * 2 <= size) {
      const cur = arr[curIdx];
      const [leftIdx, rightIdx] = [curIdx * 2, curIdx * 2 + 1]
      const [childLeft, childRight] = [arr[leftIdx], arr[rightIdx]];
      let swapIdx = -1;
      if (compareFn(childLeft, cur) < 0) swapIdx = leftIdx;
      if (
        swapIdx === -1 ?
          compareFn(childRight, cur) < 0 :
          compareFn(childRight, childLeft) < 0
      ) swapIdx = rightIdx;

      if (swapIdx === -1) break;

      this.swap(curIdx, swapIdx);
      curIdx = swapIdx;
    }

    return returnVal;
  }
}