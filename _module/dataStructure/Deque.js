/**
 * @template T
*/
class Deque {
  /** @type {T[]} */
  #arr = Array(1 << 10);
  l = 1 << 9;
  r = 1 << 9;

  constructor() {}

  #reallocate() {
    const len = this.r - this.l;
    const newArr = len >= (this.#arr.length >> 2) ? Array(this.#arr.length << 1) : Array(this.#arr.length);
    const center = this.#arr.length >> 1, offset = center - (len >> 1);
    for (let i = len - 1; i >= 0; i--) newArr[offset + i] = this.#arr[this.l + i];
    this.#arr = newArr;
    this.l = offset, this.r = offset + len;
  }

  entries() { return this.#arr.slice(this.l, this.r); }

  get length() { return this.r - this.l; }

  /** @param {T} item */
  unshift(item) {
    this.#arr[--this.l] = item;
    if (this.l === 0) this.#reallocate();
    return this.r - this.l;
  }

  /** @param {T} item */
  push(item) {
    this.#arr[this.r++] = item;
    if (this.r === this.#arr.length - 1) this.#reallocate();
    return this.r - this.l;
  }

  first() { return this.r - this.l !== 0 ? this.#arr[this.l] : null; }
  shift() { return this.r - this.l !== 0 ? this.#arr[this.l++] : null; }

  last() { return this.r - this.l !== 0 ? this.#arr[this.r - 1] : null; }
  pop() { return this.r - this.l !== 0 ? this.#arr[--this.r] : null; }
}
