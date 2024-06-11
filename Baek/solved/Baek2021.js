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
check(`10 3
1 2 3 4 5 -1
9 7 10 -1
7 6 3 8 -1
1 10`,
`2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, L], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const [s, e] = lines.pop();

// code
const visitedLines = Array(L).fill(false);
const stationLines = Array.from({ length: N + 1 }, () => []);
const minSwaps = Array(N + 1).fill(Infinity);
const queue = [];
for (let i = 0; i < L; i++) {
  const line = lines[i];
  line.pop();
  const isFirstLine = line.includes(s);
  for (const station of line) {
    stationLines[station].push(i);
    if (isFirstLine) {
      visitedLines[i] = true;
      minSwaps[station] = 0;
      queue.push(station);
    }
  }
}

loop: for (const station of queue) {
  const curSwap = minSwaps[station];
  for (const line of stationLines[station]) {
    if (visitedLines[line]) continue;
    visitedLines[line] = true;
    for (const lineStation of lines[line]) {
      if (isFinite(minSwaps[lineStation])) continue;
      minSwaps[lineStation] = curSwap + 1;
      queue.push(lineStation);
      if (lineStation === e) break loop;
    }
  }
}

// output
return isFinite(minSwaps[e]) ? minSwaps[e] : -1;
}
