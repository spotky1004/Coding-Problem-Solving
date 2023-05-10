const isDev = process?.platform !== "linux";
const [[N, Q], a, ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7 6
1 1 1 1 1 1 1
2 1 6
2 4 5
1 3 5
2 4 4
1 5 6
2 2 6`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const primes = genPrimes(1_000_000);
const divisorCounts = Array(1_000_000 + 1).fill(2);
function searchDivisors(n = 1, downFactorCount = 1, primeIdx = -1, primePow = 0) {
  const facotrCount = downFactorCount * (primePow + 1);
  divisorCounts[n] = facotrCount;

  for (let i = Math.max(0, primeIdx); i < primes.length; i++) {
    const p = primes[i];
    const newN = n * p;
    if (newN > 1_000_000) break;
    
    if (i === primeIdx) {
      searchDivisors(n * p, downFactorCount, primeIdx, primePow + 1);
    } else {
      searchDivisors(n * p, facotrCount, i, 1);
    }
  }

  return true;
}
divisorCounts[0] = 0;
divisorCounts[1] = 1;
searchDivisors();


/**
 * @template {any} T 
*/
class SegmentTree {
  /** @typedef {(left: (null | T), right: (null | T)) => T} SumFunc */

  /** @type {number} */
  size = 0;
  /** @type {number} */
  height = 0;
  /** @type {(null | T)[]} */
  tree = [null];
  /** @type {SumFunc} */
  sumFunc = (left, right) => (left ?? 0) + (right ?? 0);

  /**
   * @param {T[]} arr 
   * @param {SumFunc} sumFunc 
   */
  constructor(arr, sumFunc) {
    if (sumFunc) this.sumFunc = sumFunc;

    this.size = arr.length;
    this.height = Math.ceil(Math.log2(arr.length)) + 1;
    this.tree = Array(1 << this.height).fill(null);

    let tmp = 1 << (this.height - 1);
    for (let i = 0; i < arr.length; i++) {
      this.tree[i + tmp] = arr[i];
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
      }
    }
  }

  /**
   * @param {number} left
   * @param {number} right 
   */
  updateRange(left, right) {
    this.#updateRange(1, 1, 1 << (this.height - 1), left, right);
  }

  /**
   * @param {number} idx 
   * @param {number} start 
   * @param {number} end 
   * @param {number} left 
   * @param {number} right 
   */
  #updateRange(idx, start, end, left, right) {
    if (
      this.tree[idx] === 2 * (Math.min(this.size, end) - start + 1) ||
      right < start ||
      end < left
    ) {
      return this.tree[idx];
    }

    if (end - start === 0) {
      this.tree[idx] = divisorCounts[this.tree[idx]];
      return this.tree[idx];
    }

    const halfLen = (end - start + 1) / 2;
    this.tree[idx] = this.sumFunc(
      this.#updateRange(idx * 2, start, start + halfLen - 1, left, right),
      this.#updateRange(idx * 2 + 1, start + halfLen, end, left, right)
    );

    return this.tree[idx];
  }
  
  /**
   * @param {number} left 
   * @param {number} right 
   */
  sum(left, right) {
    return this.#sum(1, 1, 1 << (this.height - 1), left, right);
  }

  /**
   * @param {number} idx 
   * @param {number} start 
   * @param {number} end 
   * @param {number} left 
   * @param {number} right 
   */
  #sum(idx, start, end, left, right) {
    if (right < start || end < left) {
      return null;
    } else if (left <= start && end <= right) {
      return this.tree[idx];
    }

    const halfLen = (end - start + 1) / 2;
    return this.sumFunc(
      this.#sum(idx * 2, start, start + halfLen - 1, left, right),
      this.#sum(idx * 2 + 1, start + halfLen, end, left, right)
    );
  }
}

/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {(number | null)[]} */
  const net = Array.from({ length: n }, (_, i) => i);
  net[0] = null;
  net[1] = null;
  for (let i = 4; i < net.length; i += 2) {
    net[i] = null;
  }
  for (let i = 3; i < net.length; i++) {
    if (net[i] === null) continue;
    for (let j = i * 3; j < net.length; j += i * 2) {
      net[j] = null;
    }
  }
  return net.filter(v => v !== null);
}

const mainSegTree = new SegmentTree(
  a.map(v => Math.max(2, v)),
  (left, right) => (left ?? 0) + (right ?? 0)
);
const oneSegTree = new SegmentTree(
  a.map(v => v === 1 ? 1 : 0),
  (left, right) => (left ?? 0) + (right ?? 0)
);

const out = [];
for (const [type, p1, p2] of queries) {
  if (type === 1) {
    mainSegTree.updateRange(p1, p2);
  } else if (type === 2) {
    out.push(mainSegTree.sum(p1, p2) - oneSegTree.sum(p1, p2));
  }
}

console.log(out.join("\n"));
