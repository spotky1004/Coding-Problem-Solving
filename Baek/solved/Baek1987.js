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
check(`2 4
CAAB
ADCB`,
`3`);
check(`3 6
HFDFFB
AJHGDH
DGAGEH`,
`6`);
check(`5 5
IEFCJ
FHFKC
FFALF
HFGCF
HMCHH`,
`10`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [, ...board] = input
  .trim()
  .split("\n")
  .map(line => Array.from(line));
const R = board.length;
const C = board[0].length;

// code
const bitBoard = board.map(row => row.map(c => 1 << (parseInt(c, 36) - 10)));
const check = Array.from({ length: R }, () => Array.from({ length: C }, () => new Set()));
let maxTile = 1;
function search(mask, i, j, depth = 1) {
  if (check[i][j].has(mask)) return;
  check[i][j].add(mask);
  if (depth > maxTile) maxTile = depth;
  let ti, tj;
  ti = i - 1, tj = j;
  if (!(
    0 > ti || ti >= R ||
    0 > tj || tj >= C ||
    mask & bitBoard[ti][tj]
  )) search(mask + bitBoard[ti][tj], ti, tj, depth + 1);
  ti = i + 1, tj = j;
  if (!(
    0 > ti || ti >= R ||
    0 > tj || tj >= C ||
    mask & bitBoard[ti][tj]
  )) search(mask + bitBoard[ti][tj], ti, tj, depth + 1);
  ti = i, tj = j - 1;
  if (!(
    0 > ti || ti >= R ||
    0 > tj || tj >= C ||
    mask & bitBoard[ti][tj]
  )) search(mask + bitBoard[ti][tj], ti, tj, depth + 1);
  ti = i, tj = j + 1;
  if (!(
    0 > ti || ti >= R ||
    0 > tj || tj >= C ||
    mask & bitBoard[ti][tj]
  )) search(mask + bitBoard[ti][tj], ti, tj, depth + 1);
}
search(bitBoard[0][0], 0, 0);

// output
return maxTile;
}
