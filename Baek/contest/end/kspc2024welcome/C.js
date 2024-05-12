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
check(`3 10
* * * * * * * * * * saywoo
* . * . * . * . * * captain
* * * * * . . . * * usb`,
`3
0 saywoo
1 captain
3 usb`);
check(`3 10
* * * * * * * * * * saywoo
* . . . * . * . * * captain
* * * * * . . . * * usb`,
`2
0 saywoo
3 captain
3 usb`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...users] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
const maxReverses = new Set();
const out = [];
for (const user of users) {
  const name = user.pop();
  let maxReverse = 0;
  let reverse = 0;
  for (const c of user) {
    reverse++;
    if (c === "*") reverse = 0;
    maxReverse = Math.max(maxReverse, reverse);
  }
  maxReverses.add(maxReverse);
  out.push(`${maxReverse} ${name}`);
}

// output
return `${maxReverses.size}\n${out.join("\n")}`;
}
