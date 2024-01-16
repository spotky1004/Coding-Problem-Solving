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
check(`33(562(71(9)))`, `19`);
check(`123`, `3`);
check(`10342(76)`, `8`);
check(`0(0)`, `0`);
check(`1(1(1(1(1(1(1(0(1234567890))))))))`, `0`);
check(`1()66(5)`, `7`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const S = input
  .trim();

// code
let len = 0;
const stack = [];
for (let i = 0; i < S.length; i++) {
  const c = S[i];

  if (c === "(") {
    stack.push("(");
  } else if (c === ")") {
    let subLen = 0;
    while (stack[stack.length - 1] !== "(") {
      subLen += stack.pop();
    }
    stack.pop();
    stack.push(stack.pop() * subLen);
  } else {
    if (S[i + 1] === "(") {
      stack.push(Number(c));
    } else {
      stack.push(1);
    }
  }
}

// output
return stack.reduce((a, b) => a + b, 0);
}
