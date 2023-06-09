const isDev = process?.platform !== "linux";

const [[n, q], a, ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1000 10
1010001101001100110000110001101000110101110000100011000100111100101000000001110101010010101100001011100110001011111110011110111110010000110000101011110001001000001011011110111111101100011111110100100101011000111100010001011011100111000110010010111011110011000010111010111100000101101010000100100001011110000001101000110100111010001010101111111010111100011011100111111111000110001110011000100011110001101001000100100100110001001011011101010000111010110101001001111110010000110010010011000000101011010101000100110001101000110001000110111110010110011010000100101011001001001010111111001111000001010110010110001001111100111010111111010100110001011010001000100000000110000101110110010110010100100011101011110001100000010100111110000101100100000111100010000111011101001100000101110101000101110011110101000110010101001011110011000100101110000001011011110001000100101101100110011010011101001110110001100011110101111000100111100000111010010111100111111111011000101001110100011111010011000110001111010000000001
2 685 921 6 5 705 861
`
)
  .trim()
  .split("\n")
  .map((line, i) => {
    if (i === 1) return Array.from(line);
    return line.split(" ").map(Number);
  });

/**
 * @template {any} T 
*/
class SegmentTree {
  /** @typedef {(left: (null | T), right: (null | T)) => T} SumFunc */

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
   * @param {number} idx 
   * @param {T} data 
   */
  update(idx, data) {
    const leafIdx = (1 << (this.height - 1)) + idx - 1;
    this.tree[leafIdx] = data;

    for (let idx = Math.floor(leafIdx / 2); idx >= 1; idx = Math.floor(idx / 2)) {
      this.tree[idx] = this.sumFunc(
        this.tree[idx * 2],
        this.tree[idx * 2 + 1]
      );
    }
  }
  
  /**
   * @param {number} left 
   * @param {number} right 
   */
  sum(left, right) {
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
 * @typedef {[x: number, y: number, lType: 0 | 1, lCount: number, rType: 0 | 1, rCount: number]} SegTreeItem
 */

const segTree = new SegmentTree(
  /** @type {SegTreeItem[]} */
  a.map(v => {
    if (v === "0") return [1, 0, 0, 1, 0, 1];
    return [0, 1, 1, 1, 1, 1];
  }),
  (left, right) => {
    if (right === null) return left;
    if (left === null) return right;
    const [lx, ly, llt, llc, lrt, lrc] = left;
    const [rx, ry, rlt, rlc, rrt, rrc] = right;
    return [
      Math.max(
        lx, rx,
        (lrt | rlt) === 0 ? lrc + rlc : 0
      ),
      Math.max(
        ly, ry,
        (lrt & rlt) === 1 ? lrc + rlc : 0
      ),
      llt,
      llc + (llt === lrt && llt === rlt ? rlc : 0),
      rrt,
      rrc + (rrt === rlt && rlt === lrt ? lrc : 0)
    ];
  }
);

function search(l, r, xy, firstType) {
  if (xy[firstType] === 0) return null;
  const rangeSum = segTree.sum(l, r);
  if (
    rangeSum[0] < xy[0] ||
    rangeSum[1] < xy[1]
  ) return null;

  const secondType = firstType ^ 1;
  const fVal = xy[firstType];
  const sVal = xy[secondType];

  const fLeft = typeSearch(firstType, l, r, fVal, 0);
  const fRight = typeSearch(firstType, l, r, fVal, 1);
  console.log(fLeft, fRight, typeSearch(firstType, fLeft, r, fVal, 1), typeSearch(firstType, l, fRight, fVal, 1));

  const seconds = [
    [typeSearch(secondType, l, fLeft, sVal, 0), fLeft],
    [typeSearch(secondType, l, fLeft, sVal, 1), fLeft],
    [fRight, typeSearch(secondType, fRight, r, sVal, 0)],
    [fRight, typeSearch(secondType, fRight, r, sVal, 1)],
  ];
  for (const [l, r] of seconds) {
    const sum = segTree.sum(l, r);
    if (
      sum[firstType] === fVal &&
      sum[secondType] === sVal
    ) return `${l} ${r}`
  }

  if (fLeft < fRight) {
    const newL = typeSearch(firstType, l, fLeft, fVal, 1);
    const newR = typeSearch(firstType, fRight, r, fVal, 0);
    if (newL === l && newR === r) return null;
    return search(
      typeSearch(firstType, l, fLeft, fVal, 1), typeSearch(firstType, fRight, r, fVal, 0),
      xy,
      firstType
    );
  }
  return null;
}

function typeSearch(type, l, r, toFind, side) {
  let left = l - 1, right = r + 1, mid;
  if (side === 0) {
    while (left + 1 < right) {
      mid = Math.floor((left + right) / 2);
      if (segTree.sum(l, mid)[type] <= toFind) left = mid;
      else right = mid;
    }
    return left;
  } else {
    while (left + 1 < right) {
      mid = Math.floor((left + right) / 2);
      if (segTree.sum(mid, r)[type] > toFind) left = mid;
      else right = mid;
    }
    return right;
  }
}

const out = [];
for (const [type, p1, p2, p3, p4] of queries) {
  if (type === 1) {
    segTree.update(p1, p2 === 0 ? [1, 0, 0, 1, 0, 1] : [0, 1, 1, 1, 1, 1]);
  } else {
    out.push(search(p1, p2, [p3, p4], 0) ?? search(p1, p2, [p3, p4], 1) ?? "-1");
  }
}
console.log(out.join("\n"));
