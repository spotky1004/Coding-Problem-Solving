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
check(`1
6
13 11 40 10 33 19`,
`23`);
check(`1
20
0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 32787`,
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
  .map(line => line.split(" ").map(Number));

// code
const out = [];
const maxX = 2**30 - 1;
for (let caseNr = 0; caseNr < T; caseNr++) {
  const [N] = lines[2 * caseNr];
  const A = lines[2 * caseNr + 1];

  let x = 0;
  let maxMex = 1;
  while (true) {
    const newX = Math.min(maxX, 2 * x + 1);
    const andA = A.map(v => v & newX).sort((a, b) => a - b);
    let mex = 0;
    for (const andAi of andA) {
      if (andAi === mex) mex++;
    }
    if (mex < maxMex) break;
    maxMex = mex;
    x = newX;
    if (x === maxX) break;
  }
  out.push(x);
}

// output
return out.join("\n");
}
