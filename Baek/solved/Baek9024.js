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
check(`4
10 8
-7 9 2 -4 12 1 5 -3 -2 0
10 4
-7 9 2 -4 12 1 5 -3 -2 0
4 20
1 7 3 5
5 10
3 9 7 1 5`,
`1
5
1
2`);
check(`1
2 0
-1 100`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[t], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const out = [];
for (let caseNr = 0; caseNr < t; caseNr++) {
  const [n, K] = lines[2 * caseNr];
  const S = lines[2 * caseNr + 1];
  
  let minDiff = Infinity;
  let minDiffCount = 0;
  S.sort((a, b) => a - b);
  let l = 0, r = n - 1;
  while (l < r) {
    while (r !== 0 && K - S[l] - S[r] < 0) r--;
    let diff;
    diff = Math.abs(K - S[l] - S[r]);
    if (diff <= minDiff && l < r) {
      if (diff !== minDiff) minDiffCount = 0;
      minDiff = diff;
      minDiffCount++;
    }
    if (r !== n - 1 && l < r + 1) {
      diff = Math.abs(K - S[l] - S[r + 1]);
      if (diff <= minDiff) {
        if (diff !== minDiff) minDiffCount = 0;
        minDiff = diff;
        minDiffCount++;
      }
    }
    l++;
  }

  out.push(minDiffCount);
}

// output
return out.join("\n");
}
