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
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`3
95 95
0 1 2`,
`2
2 3
1 2`);
check(`3
85 90
1 0 2`,
`5
1 3
2 1
3 2
1 3
2 1`);
check(`3
100 95
2 1 0`,
`-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], goalD, goalT] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const typeIdxes = [
   12,  21,
  102, 120,
  201, 210
];
const typeIdxesInv = new Map(typeIdxes.map((v, i) => [v, i]));
const stateToIdx = ([d1, t1], [d2, t2], [d3, t3]) => typeIdxesInv.get(t1 * 100 + t2 * 10 + t3) * 9261 + (d1 / 5) * 441 + (d2 / 5) * 21 + (d3 / 5);
const idxToState = (idx) => {
  const d3 = (idx % 21) * 5;
  idx = Math.floor(idx / 21);
  const d2 = (idx % 21) * 5;
  idx = Math.floor(idx / 21);
  const d1 = (idx % 21) * 5;
  idx = Math.floor(idx / 21);
  const [t1, t2, t3] = Array.from(typeIdxes[idx].toString().padStart(3, "0")).map(Number);
  return [[d1, t1], [d2, t2], [d3, t3]];
}

const initialState = stateToIdx([100, 1], [100, 2], [0, 0]);
const goalState = stateToIdx(
  [goalD[goalT[0] - 1] ?? 0, goalT[0]],
  [goalD[goalT[1] - 1] ?? 0, goalT[1]],
  [goalD[goalT[2] - 1] ?? 0, goalT[2]]
);
const maxState = stateToIdx([100, 2], [100, 1], [100, 0]);

/** @type {[move: [number, number], prev: number?][]} */
const dp = Array.from({ length: maxState }, _ => null);
dp[initialState] = [[-1, -1], null];
const queue = [initialState];
for (const stateIdx of queue) {
  const state = idxToState(stateIdx);
  const emptySlot = state.findIndex(v => v[1] === 0);
  for (let i = 0; i < 3; i++) {
    if (i === emptySlot) continue;
    const newState = [...state];
    const newTemp = newState[i][0] - 5;
    if (newTemp < 5) continue;
    newState[emptySlot] = [newState[i][0] - 5, newState[i][1]];
    newState[i] = [0, 0];

    const idx = stateToIdx(...newState);
    if (dp[idx] !== null) continue;

    dp[idx] = [[i + 1, emptySlot + 1], stateIdx];
    queue.push(idx);
  }
}

if (dp[goalState] === null) return -1;

const moves = [];
for (let i = goalState; dp[i][1] !== null; i = dp[i][1]) {
  moves.push(dp[i][0].join(" "));
}
moves.reverse();

// output
return moves.length + "\n" + moves.join("\n");
}
