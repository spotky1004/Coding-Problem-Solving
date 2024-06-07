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
check(`3
4 3
4 4
4 5`,
`9111111
1111116
1111115`);
check(`1
3 17`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[t], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const out = [];
for (const [n, m] of cases) {
  const digitVals = [1];
  for (let i = 1; i < 2 * n; i++) digitVals.push(digitVals[i - 1] * 10 % m);
  const digitValMults = [];
  for (let i = 0; i < 2 * n; i++) {
    const vals = [];
    digitValMults.push(vals);
    for (let j = 0; j <= 11; j++) vals.push(digitVals[i] * j % m);
  }

  function search(modVal = 0, digitIdx = 0, segIdx = 0) {
    // console.log(modVal, digitIdx, segIdx);
    if (segIdx === n) {
      if (modVal === 0) return true;
      return false;
    }

    let maxVal = "";
    let value11 = modVal + digitValMults[digitIdx][11];
    if (value11 >= m) value11 -= m;
    const result11 = search(value11, digitIdx + 2, segIdx + 1);
    if (result11 !== false) {
      const newVal = (result11 === true ? "" : result11) + "11";
      if (Number(newVal) > Number(maxVal)) maxVal = newVal;
    }

    for (let i = 9; i >= 0; i--) {
      let value = modVal + digitValMults[digitIdx][i];
      if (value >= m) value -= m;
      const result = search(value, digitIdx + 1, segIdx + 1);
      if (result !== false) {
        const newVal = (result === true ? "" : result) + i.toString();
        if (Number(newVal) > Number(maxVal)) maxVal = newVal;
      }
    }
    return maxVal;
  }
  out.push(BigInt(search()).toString());
}

// output
return out.join("\n");
}
