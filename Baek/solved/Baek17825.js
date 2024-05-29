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
check(`1 2 3 4 1 2 3 4 1 2`, `190`);
check(`1 1 1 1 1 1 1 1 1 1`, `133`);
check(`5 1 2 3 4 5 5 3 2 4`, `214`);
check(`5 5 5 5 5 5 5 5 5 5`, `130`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [dices] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
class Cell {
  value = 0;
  next = null;
  blueNext = null;

  constructor(value) {
    this.value = value;
  }

  move(count) {
    let cur = this;
    if (cur.blueNext !== null) {
      cur = cur.blueNext;
      count--;
    }
    while (count > 0 && cur.next !== null) {
      cur = cur.next;
      count--;
    }
    return cur;
  }
}
const mkCell = (value) => new Cell(value);
const cells = [
  /** [ 0,  4] */  mkCell(0),  mkCell(2),  mkCell(4),  mkCell(6),  mkCell(8),
  /** [ 5,  9] */ mkCell(10), mkCell(12), mkCell(14), mkCell(16), mkCell(18),
  /** [10, 14] */ mkCell(20), mkCell(22), mkCell(24), mkCell(26), mkCell(28),
  /** [15, 19] */ mkCell(30), mkCell(32), mkCell(34), mkCell(36), mkCell(38),
  /** [20, 24] */ mkCell(40),  mkCell(0), mkCell(13), mkCell(16), mkCell(19),
  /** [25, 29] */ mkCell(25), mkCell(22), mkCell(24), mkCell(28), mkCell(27),
  /** [30, 32] */ mkCell(26), mkCell(30), mkCell(35)
];
for (let i = 0; i <= 20; i++) cells[i].next = cells[i + 1];
cells[5].blueNext = cells[22];
cells[22].next = cells[23];
cells[23].next = cells[24];
cells[24].next = cells[25];
cells[10].blueNext = cells[26];
cells[26].next = cells[27];
cells[27].next = cells[25];
cells[15].blueNext = cells[28];
cells[28].next = cells[29];
cells[29].next = cells[30];
cells[30].next = cells[25];
cells[25].next = cells[31];
cells[31].next = cells[32];
cells[32].next = cells[20];
const endCell = cells[21];

let maxScore = 0;
const queue = [[0, 0, cells[0], cells[0], cells[0], cells[0]]];
for (const [moveCount, score, ...horses] of queue) {
  if (moveCount === 10) {
    maxScore = Math.max(maxScore, score);
    continue;
  }
  const curDice = dices[moveCount];
  loop: for (let i = 0; i < 4; i++) {
    const newItem = [moveCount + 1, score, ...horses];
    if (horses[i] === endCell) {
      queue.push([moveCount + 1, score, endCell, endCell, endCell, endCell]);
      continue;
    }
    newItem[2 + i] = horses[i].move(curDice);
    for (let j = 0; j < 4; j++) if (i !== j && newItem[2 + i] === newItem[2 + j] && newItem[2 + i] !== endCell) continue loop;
    newItem[1] += newItem[2 + i].value;
    queue.push(newItem);
  }
}

// output
return maxScore;
}
