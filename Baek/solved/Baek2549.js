const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`1 2 15 4
7 8 3 6
9 10 5 12
13 14 11 16`,
`2
2 3 3
1 2 2`);
check(`14 3 4 13
2 7 8 1
6 11 12 5
10 15 16 9`,
`6
1 1 1
1 2 1
1 4 1
1 3 1
2 2 3
2 1 3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const board = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/** @param {number[]} state */
const hashState = (state) => state.flat().join(" ");
const decodeHashState = (hash) => {
  hash = hash.split(" ").map(Number);
  const state = [];
  for (let i = 0; i < 4; i++) state.push(hash.splice(0, 4));
  return state;
}

/**
 * @param {number[][]} initialState 
 * @param {number} maxMove 
 */
function search(initialState, maxMove, isInv) {
  const queue = [initialState.flat()];
  /** @type {Map<ReturnType<typeof hashState>, [prevStateHash: ReturnType<typeof hashState>, moves: number, move: [number, number, number]]>} */
  const hashStateMap = new Map();
  hashStateMap.set(hashState(queue[0]), [null, 0, []]);

  for (const curState of queue) {
    const curStateHash = hashState(curState);
    const nextMoves = hashStateMap.get(curStateHash)[1] + 1;

    for (let i = 0; i <= 1; i++) {
      for (let j = 0; j <= 3; j++) {
        const lineValues = [];
        if (i === 0) for (let l = 0; l < 4; l++) lineValues.push(curState[4 * j + l]);
        else for (let l = 0; l < 4; l++) lineValues.push(curState[4 * l + j]);

        for (let k = 1; k <= 3; k++) {
          const nextState = [...curState];
          if (i === 0) for (let l = 0; l < 4; l++) nextState[4 * j + l] = lineValues[(l + k) % 4];
          else for (let l = 0; l < 4; l++) nextState[4 * l + j] = lineValues[(l + k) % 4];

          const nextStateHash = hashState(nextState);
          if (hashStateMap.has(nextStateHash)) continue;
          hashStateMap.set(nextStateHash, [curStateHash, nextMoves, [i + 1, j + 1, isInv ? k : 4 - k]]);
          if (nextMoves === maxMove) continue;
          queue.push(nextState);
        }
      }
    }
  }

  return hashStateMap;
}

const goalState = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16]
];
const startStateHash = hashState(board);
const goalStateHash = hashState(goalState);

const fromStart = search(board, 3, false);
const fromEnd = search(goalState, 4, true);

let minMoveCount = Infinity;
let minMove = [];
if (fromStart.has(goalStateHash)) {
  const moveCount = fromStart.get(goalStateHash)[1];
  minMoveCount = moveCount;
  for (let curHash = goalStateHash; curHash !== null; curHash = fromStart.get(curHash)[0]) {
    if (curHash === startStateHash) continue;
    minMove.push(fromStart.get(curHash)[2]);
  }
  minMove.reverse();
}

for (const [hash, [, moves]] of fromStart) {
  if (!fromEnd.has(hash)) continue;

  const moveCount = moves + fromEnd.get(hash)[1];
  if (moveCount >= minMoveCount) continue;
  minMoveCount = moveCount;
  const sMoves = [];
  for (let curHash = hash; curHash !== null; curHash = fromStart.get(curHash)[0]) {
    const move = fromStart.get(curHash)[2];
    // console.table(decodeHashState(curHash));
    // console.log(fromStart.get(curHash));
    if (!move || move.length === 0) continue;
    sMoves.push(move);
  }
  sMoves.reverse();
  const eMoves = [];
  for (let curHash = hash; curHash !== null; curHash = fromEnd.get(curHash)[0]) {
    const move = fromEnd.get(curHash)[2];
    // console.table(decodeHashState(curHash));
    // console.log(fromEnd.get(curHash));
    if (!move || move.length === 0) continue;
    eMoves.push(move);
  }
  minMove = [...sMoves, ...eMoves];
}

// output
return `${minMoveCount}\n${minMove.map(move => move.join(" ")).join("\n")}`;
}
