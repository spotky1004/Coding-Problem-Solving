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
30 123
30 1
39 12222444456679999`,
`R 10
C 20
122233338889`);
check(`1
100 1234444`,
``);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[t], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
const calcNext = (x) => {
  const rev = Array.from(BigInt(x).toString()).reverse().join("");
  return BigInt(Array.from((BigInt(x) + BigInt(rev)).toString()).sort().join("")).toString();
}

const chainRegex1 = new RegExp("^1233+4444$", "");
const chainRegex2 = new RegExp("^5566+7777$", "");
const out = [];
caseLoop: for (const [M, n] of cases) {
  const numM = Number(M);
  const seq = [n];
  for (let i = 2; i <= numM; i++) {
    seq.push(calcNext(seq[i - 2]));
  }
  const seen = new Set();
  for (let i = 1; i <= numM; i++) {
    const value = seq[i - 1];
    if (seen.has(value)) {
      out.push(`R ${i}`);
      continue caseLoop;
    }
    seen.add(value);
    if (chainRegex1.test(value) || chainRegex2.test(value)) {
      out.push(`C ${i}`);
      continue caseLoop;
    }
  }
  out.push(seq[numM - 1]);
}

// output
return out.join("\n");
}
