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
check(`8 9 10`, `1 2 8 9 10`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const caps = input
  .trim()
  .split(" ")
  .map(Number);

// code
const stateToKey = ([a, b, c]) => a * 1e6 + b * 1e3 + c;
const move = (state, from, to) => {
  state = [...state];
  const moveValue = Math.min(caps[to] - state[to], state[from]);
  state[from] -= moveValue;
  state[to] += moveValue;
  return state;
}

const out = new Set([caps[2]]);
const firstState = [0, 0, caps[2]];
const seen = new Set([stateToKey(firstState)]);
const queue = [firstState];
for (const state of queue) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === j) continue;
      const newState = move(state, i, j);
      const key = stateToKey(newState);
      if (seen.has(key)) continue;
      seen.add(key);
      if (newState[0] === 0) out.add(newState[2]);
      queue.push(newState);
    }
  }
}

// output
return [...out].sort((a, b) => a - b).join(" ");
}
