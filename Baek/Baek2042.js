const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 2 2
1
2
3
4
5
1 3 6
2 2 5
1 5 2
2 3 5`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

/** @type {number[]} */
const [N, M, K] = input.shift();
const numbers = input.splice(0, N).flat();
const questions = input.splice(0, M + K);

/** @typedef {[number, SegTree, SegTree]} SegTree */
/**
 * @param {SegTree} tree
 * @param {number[]} nums
 * @returns {SegTree}
 */
function initSegTree(tree, nums) {
  const center = Math.ceil(nums.length / 2);
  const left = nums.slice(0, center);
  const right = nums.slice(center);
  if (left.length > 1) {
    tree.push(initSegTree([], left));
  } else {
    tree.push([left[0]]);
  }
  if (right.length > 1) {
    tree.push(initSegTree([], right));
  } else {
    tree.push([right[0]]);
  }
  const sum = (Array.isArray(tree[0]) ? tree[0][0] : left[0]) + (Array.isArray(tree[1]) ? tree[1][0] : right[0]);
  tree.unshift(sum);
  return tree;
}

const treeSize = numbers.length;
const segTree = initSegTree([], numbers);

/**
 * 
 * @param {SegTree} tree 
 * @param {number} size 
 * @param {number} from 
 * @param {number} to 
 */
function getSum(tree, size, from, to) {
  console.log(tree, size, from, to);
  const leftSize = Math.ceil(size / 2);
  const rightSize = Math.floor(size / 2);
  if (size === 1) {
    return tree[0];
  }
  if (size === 2) {
    if (from === to) {
      return tree[from + 1][0];
    }
    return tree[0];
  }
  if (from === 0 && to === size - 1) return tree[0];

  if (from < leftSize) {
    if (to < leftSize) {
      return getSum(tree[1], leftSize, from, to);
    } else {
      return tree[1][0] + getSum(tree[2], rightSize, 0, to - leftSize - 1);
    }
  } else {
    return getSum(tree[2], rightSize, from - leftSize - 1, to - leftSize - 1);
  }
}
console.log(getSum(segTree, treeSize, 3, 6));
