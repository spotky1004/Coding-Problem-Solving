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
2
0 0
1000 0
1000 1000
2000 1000
2
0 0
1000 0
2000 1000
2000 2000`,
`happy
sad`);
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
let line = 0;
const out = [];
for (let caseNr = 0; caseNr < t; caseNr++) {
  const [n] = lines[line++];

  const points = [];
  for (let i = 0; i < n + 2; i++) {
    points.push(lines[line++]);
  }

  const isReachable = Array(n + 2).fill(false);
  isReachable[0] = true;
  let updated = true;
  while (updated) {
    updated = false;
    loop: for (let i = 0; i < points.length; i++) {
      if (isReachable[i]) continue;
      const [x1, y1] = points[i];
      for (let j = 0; j < points.length; j++) {
        if (!isReachable[j]) continue;
        const [x2, y2] = points[j];
        const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
        if (dist > 1000) continue;
        isReachable[i] = true;
        updated = true;
        continue loop;
      }
    }
  }

  if (isReachable[n + 1]) out.push("happy");
  else out.push("sad");
}

// output
return out.join("\n");
}
