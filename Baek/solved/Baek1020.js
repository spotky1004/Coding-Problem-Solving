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
    ) ;//console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`007`, `11`);
check(`1`, `10`);
check(`3`, `2`);
check(`9`, `3`);
check(`99`, `5`);
check(`654371`, `43`);
check(`99886`, `114`);
check(`999888`, `112`);
check(`111111111111111`, `1000000000000000`);
check(`0317`, `54`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const curTimeStr = input
  .trim();

// code
const lines = [6, 2, 5, 5, 4, 5, 6, 3, 7, 5];

const curTime = Number(curTimeStr);
const curTimeSplit = curTimeStr.split("").map(Number);
const N = curTimeSplit.length;
const loopInterval = 10**N;
const lineGoal = curTimeSplit.reduce((acc, v) => acc + lines[v], 0);

function calcTime(from, to) {
  if (to === -1) return Infinity;
  if (from < to) return to - from;
  return to - from + loopInterval;
}

function searchClose(avaiables, close=[], over=false) {
  if (close.length === N) {
    if (!over) return -1;
    return Number(close.join(""));
  }

  const start = !over ? curTimeSplit[close.length] : 0;
  for (let i = start; i <= 9; i++) {
    if (avaiables[i] === 0) continue;
    avaiables[i]--;
    close.push(i);
    const result = searchClose(avaiables, close, over || (i > start));
    if (result !== -1) return result;
    avaiables[i]++;
    close.pop();
  }
  return -1;
}

let searchingLines = 0;
const searching = [];
let minTime = loopInterval;
function search() {
  if (searching.length === N) {
    if (searchingLines !== lineGoal) return;
    const max = Number([...searching].sort().join(""));
    const min = Number(max.toString().split("").reverse().join(""));
    const counts = Array(10).fill(0);
    for (const v of searching) counts[v]++;
    const closeNext = searchClose(counts);

    minTime = Math.min(
      minTime,
      calcTime(curTime, max),
      calcTime(curTime, min),
      calcTime(curTime, closeNext)
    );
    return;
  }
  
  for (let i = searching[searching.length - 1] ?? 0; i <= 9; i++) {
    searching.push(i);
    searchingLines += lines[i];
    search();
    searching.pop();
    searchingLines -= lines[i];
  }
}
search();

// output
return minTime;
}
