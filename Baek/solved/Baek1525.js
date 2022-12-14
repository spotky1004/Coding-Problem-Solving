const isDev = process?.platform !== "linux";
const rawInitialBoard = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1 0 3
4 2 5
7 8 6`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const initialBoard = Number(rawInitialBoard.flat().join(""));

const swapableIdx = [
  [1, 3],
  [0, 2, 4],
  [1, 5],

  [0, 4, 6],
  [1, 3, 5, 7],
  [2, 4, 8],

  [3, 7],
  [4, 6, 8],
  [5, 7]
];

/** @type {Set<number>} */
const memo = new Set();
memo.add(initialBoard);

const pows = Array.from({ length: 9 }, (_, i) => 10**i).reverse();

let moveCount = 0;
const successState = 123456780;
let success = false;
/** @type {number[]} */
let queue = [initialBoard];
/** @type {number[]} */
let nextQueue = [];

if (initialBoard === successState) {
  console.log(0);
  process.exit(0);
}

loop: while (queue.length > 0) {
  moveCount++;

  for (const board of queue) {
    const boardStr = board.toString().padStart(9, "0");
    let zeroIdx = -1;
    for (let i = 0; i < boardStr.length; i++) {
      if (boardStr[i] === "0") {
        zeroIdx = i;
        break;
      }
    }

    for (const swapIdx of swapableIdx[zeroIdx]) {
      let clone = board;
      clone -= boardStr[swapIdx] * pows[swapIdx];
      clone += boardStr[swapIdx] * pows[zeroIdx];

      if (memo.has(clone)) continue;
      if (clone === successState) {
        success = true;
        break loop;
      }

      nextQueue.push(clone);
      memo.add(clone);
    }
  }

  queue = nextQueue;
  nextQueue = [];
}

console.log(success ? moveCount : -1)
