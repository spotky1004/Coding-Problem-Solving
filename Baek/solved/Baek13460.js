const isDev = process.platform !== "linux";
const [, ...rawBoard] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 10
##########
#.#......#
##.......#
#OR..B.#.#
##########`
)
  .trim()
  .split("\n")
  .map(line => Array.from(line));

  const [N, M] = [rawBoard.length, rawBoard[0].length];

/** @typedef {[x: number, y: number]} Position */

/** @type {(0 | 1 | 2)[][]} */
const board = [];
/** @type {Position?} */
let rPos = null;
/** @type {Position?} */
let bPos = null;
for (let y = 0; y < N; y++) {
  const rawRow = rawBoard[y];
  const row = [];
  board.push(row);
  for (let x = 0; x < M; x++) {
    const tile = rawRow[x];
    row.push(tile === "#" ? 1 : tile === "O" ? 2 : 0);

    if (tile === "R") {
      rPos = [x, y];
    } else if (tile === "B") {
      bPos = [x, y];
    }
  }
}


/** @type {Position[]} */
const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];

/** @typedef {[rPos: Position, bPos: Position][]} MarbleQueue */

/** @type {Set<string>} */
const memo = new Set();
memo.add(rPos + "," + bPos);

let moveCount = 0;
/** @type {MarbleQueue} */
let queue = [[rPos, bPos]];
/** @type {MarbleQueue} */
let nextQueue = [];
loop: while (true) {
  moveCount++;
  if (moveCount > 10) break;

  for (const marbles of queue) {
    directionLoop: for (const [dx, dy] of directions) {
      const axisPriority = dx !== 0 ? 0 : 1;
      const axisSign = Math.sign(axisPriority ? dy : dx);
      /** @type {[number, number]} */
      const marblesPriority = marbles
        .map((v, i) => [v, i])
        .sort((a, b) => axisSign * (b[0][axisPriority] - a[0][axisPriority]))
        .map(v => v[1]);
      
      /** @type {Position[]} */
      const newPos = [null, null];
      let otherMarblePos = marbles[marblesPriority[1]];
      let isSuccess = false;
      marbleLoop: for (const marbleIdx of marblesPriority) {
        let marblePos = marbles[marbleIdx].slice(0);
        board[otherMarblePos[1]][otherMarblePos[0]] = 1;
        
        let moved = false;
        while (true) {
          const nx = marblePos[0] + dx;
          const ny = marblePos[1] + dy;
          if (board[ny][nx] === 2) {
            board[otherMarblePos[1]][otherMarblePos[0]] = 0;
            if (marbleIdx === 1) {
              continue directionLoop;
            }
            isSuccess = true;
            otherMarblePos = [0, 0];
            continue marbleLoop;
          }
          if (board[ny][nx] === 1) break;
          moved = true;
          marblePos = [nx, ny];
        }
        
        // if (!moved) {
        //   continue directionLoop;
        // }

        board[otherMarblePos[1]][otherMarblePos[0]] = 0;
        otherMarblePos = marblePos;
        newPos[marbleIdx] = marblePos;
      }
      
      if (isSuccess) {
        break loop;
      }

      const memoId = newPos[0] + "," + newPos[1];
      if (memo.has(memoId)) continue;
      memo.add(memoId);
      nextQueue.push(newPos);
    }
  }

  queue = nextQueue;
  nextQueue = [];
}

console.log(moveCount > 10 ? -1 : moveCount);
