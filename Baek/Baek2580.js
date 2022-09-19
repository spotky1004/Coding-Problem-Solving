/** @type {"dev" | "submit"} */
const mode = "submit";

const input = mode === "dev" ? `0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0` : (() => (require("fs").readFileSync("/dev/stdin") + "").trim())();

/**
 * @typedef {(number | number[])[]} Board
 * @typedef {[rows: Set<number>[], cols: Set<number>[], blocks: Set<number>[]]} Bundles
 */

const getNumbers = () => [1, 2, 3, 4, 5, 6, 7, 8, 9];
/** @type {Board} */
const startBoard = input.split("\n").map(row => row.split(" ").map(Number).map(n => n === 0 ? getNumbers() : n));

const startRows = startBoard.map(row => new Set(row.filter(n => !Array.isArray(n))));
const startCols = [];
for (let x = 0; x < 9; x++) {
  const col = new Set();
  for (let y = 0; y < 9; y++) {
    const n = startBoard[y][x];
    if (Array.isArray(n)) continue;
    col.add(n);
  }
  startCols.push(col);
}
const startBlocks = [];
for (let i = 0; i < 9; i++) {
  const block = new Set();
  const bx = i%3;
  const by = Math.floor(i/3);
  for (let y = by*3; y < (by+1)*3; y++) {
    for (let x = bx*3; x < (bx+1)*3; x++) {
      const n = startBoard[y][x];
      if (Array.isArray(n)) continue;
      block.add(n);
    }
  }
  startBlocks.push(block);
}
/** @type {Bundles} */
const startBundle = [startRows, startCols, startBlocks];

/**
 * @param {Board} board
 * @param {Bundles} bundles
 * @param {number} x 
 * @param {number} y 
 */
function updateMemo(board, bundles, x, y) {
  const [rows, cols, blocks] = bundles;
  const blockX = Math.floor(x/3);
  const blockY = Math.floor(y/3);
  const row = rows[y];
  const col = cols[x];
  const block = blocks[blockX + blockY*3];
  const clues = new Set([...row, ...col, ...block]);
  const missingNums = getNumbers().filter(n => !clues.has(n));
  board[y][x] = missingNums;
}
/**
 * @param {Board} board
 * @param {Bundles} bundles
 */
function updateAllMemo(board, bundles) {
  for (let y = 0; y < 9; y++) {
    const row = board[y];
    for (let x = 0; x < 9; x++) {
      const n = row[x];
      if (Array.isArray(n)) {
        void updateMemo(board, bundles, x, y);
        const updatedN = row[x];
        if (updatedN.length === 1) {
          const newN = updatedN[0];
          const blockIdx = Math.floor(x/3) + Math.floor(y/3)*3;
          const tileBundles = [
            bundles[0][y],
            bundles[1][x],
            bundles[2][blockIdx]
          ];
          for (const tileBundle of tileBundles) {
            if (tileBundle.has(newN)) return false;
            tileBundle.add(newN);
          }
          row[x] = updatedN[0];
        } else if (updatedN.length === 0) {
          return false;
        }
      }
    }
  }
  return true;
}

/**
 * @param {"row" | "col" | "block"} type 
 * @param {number} nr 
 * @returns {[x: number, y: number][]}
 */
function generateBundlePositions(type, nr) {
  if (type === "row") {
    return Array.from({ length: 9 }, (_, i) => [i, nr])
  } else if (type === "col") {
    return Array.from({ length: 9 }, (_, i) => [nr, i])
  } else if (type === "block") {
    const poses = [];
    const blockX = nr%3;
    const blockY = Math.floor(nr/3);
    for (let x = blockX*3; x < (blockX+1)*3; x++) {
      for (let y = blockY*3; y < (blockY+1)*3; y++) {
        poses.push([x, y]);
      }
    }
    return poses;
  }
  return [];
}
/**
 * @returns {[x: number, y: number][][]}
 */
function getAllBundlePositions() {
  const blocks = [];
  for (let i = 0; i < 9; i++) blocks.push(generateBundlePositions("row", i));
  for (let i = 0; i < 9; i++) blocks.push(generateBundlePositions("col", i));
  for (let i = 0; i < 9; i++) blocks.push(generateBundlePositions("block", i));
  return blocks;
}

const blockPositions = getAllBundlePositions();
/**
 * @param {Board} board
 * @param {Bundles} bundles
 */
function fillAvaiables(board, bundles) {
  let lastResult = "";

  while (true) {
    const result = updateAllMemo(board, bundles);
    if (!result) return false;
    for (const poses of blockPositions) {
      /** @type {(number | number[])[]} */
      const tiles = poses.map(([x, y]) => board[y][x]);
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        if (typeof tile === "number") continue;
  
        const others = [...new Set(tiles.filter((_, _i) => i !== _i).flat(2))];
        const decideds = tile.filter(n => !others.includes(n));
        if (decideds.length === 1) {
          const n = decideds[0];
          const [x, y] = poses[i];
          const blockIdx = Math.floor(x/3) + Math.floor(y/3)*3;
          const tileBundles = [
            bundles[0][y],
            bundles[1][x],
            bundles[2][blockIdx]
          ];
          for (const tileBundle of tileBundles) {
            if (tileBundle.has(n)) return false;
            tileBundle.add(n);
          }
          board[y][x] = n;
        }
      }
    }

    const curResult = board.toString();
    if (lastResult === curResult) break;
    lastResult = curResult;
  }
  return true;
}

/**
 * @param {Board} board
 * @param {Bundles} bundles 
 * @returns {Board | false}
 */
function solve(board, bundles) {
  const result = fillAvaiables(board, bundles);
  if (!result) return false;
  const isSolved = board.every(row => row.every(n => typeof n === "number"));
  if (isSolved) {
    return board;
  } else {
    const maxPossibilityIdx = board.flat().reduce((acc, cur, idx) => {
      if (Array.isArray(cur) && acc[1] > cur.length) {
        return [idx, cur.length];
      }
      return acc;
    }, [-1, Infinity])[0];
    if (maxPossibilityIdx === -1) {
      throw new Error("Unknown error");
    }

    const x = maxPossibilityIdx%9;
    const y = Math.floor(maxPossibilityIdx/9);
    const blockIdx = Math.floor(x/3) + Math.floor(y/3)*3;
    const avaiableNums = board[y][x];
    numberLoop: for (const n of avaiableNums) {
      const newBoard = board.map(row => row.slice(0)).slice(0);
      /** @type {Bundles} */
      const newBundles = bundles.map(bundle => bundle.map(set => new Set([...set])));
      const tileBundles = [
        newBundles[0][y],
        newBundles[1][x],
        newBundles[2][blockIdx]
      ];
      for (const tileBundle of tileBundles) {
        if (tileBundle.has(n)) continue numberLoop;
        tileBundle.add(n);
      }
      newBoard[y][x] = n;
      if (mode === "dev") {
        console.table(newBoard.map(row => row.map(n => typeof n === "number" ? n : n.join(""))));
      }
      const result = solve(newBoard, newBundles);
      if (result) return result;
    }
    return false;
  }
}
const solvedBoard = solve(startBoard, startBundle);

console.log(solvedBoard.map(row => row.join(" ")).join("\n"))
