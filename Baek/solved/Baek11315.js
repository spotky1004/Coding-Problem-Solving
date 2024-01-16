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
check(`2
4 30
08:30 USER alice LOG_IN
09:00 USER bob LOG_IN
09:30 USER alice LOG_IN
10:00 USER bob LOG_IN
4 45
08:30 USER alice LOG_IN
09:00 USER bob LOG_IN
09:30 USER alice LOG_IN
10:00 USER bob LOG_IN`,
`2 1
2 2`);
check(`1
3 10
09:00 USER a LOG_IN
09:05 USER a LOG_IN
09:14 USER b LOG_IN`,
``);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
const out = [];
let line = 0;
for (let caseNr = 0; caseNr < T; caseNr++) {
  const [E, TO] = lines[line++].map(Number);

  /**
   * name: expire at
   * @type {Map<string, number>}
   */
  let sessions = new Map();
  let maxSessionCount = 0;
  let time = 0;
  for (let i = 0; i < E; i++) {
    const log = lines[line++];
    
    const [h, m] = log[0].split(":").map(Number);
    time = 60 * h + m;
    
    if (log.length === 3) {
      for (const [userName] of sessions) {
        sessions.set(userName, time - 1);
      }
    } else if (log.length === 4) {
      const [, , userName, loginType] = log;
      if (loginType === "LOG_IN") {
        sessions.set(userName, time + TO - 1);
      } else if (loginType === "LOG_OUT") {
        sessions.set(userName, time - 1);
      }
    }

    const curSessionCount = [...sessions.entries()].reduce((a, b) => a + (b[1] >= time), 0);
    maxSessionCount = Math.max(maxSessionCount, curSessionCount);
  }

  const userCount = sessions.size;

  out.push(`${userCount} ${maxSessionCount}`);
}

// output
return out.join("\n");
}
