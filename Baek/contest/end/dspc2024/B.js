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
check(`12
A+BC+C0C-B0B-B+A0AC+C-`,
`EBBBBDBPEPBB`);
check(`3
ABC`,
`EBB`);
check(`4
A+A0AA-`,
`EPPD`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [N, S] = input
  .trim()
  .split("\n");

// code
const out = [];
const stack = [];
let prevGrade = "";
const calcGrade = () => {
  if (stack.length === 0) return;
  let grade = "";
  if (stack.length === 1) grade = stack[0] + "0";
  else grade = stack.join("");
  if (["C+", "C0", "C-"].includes(grade)) {
    out.push("B");
  } else if (["B0", "B-"].includes(grade)) {
    if (["", "C+", "C0", "C-"].includes(prevGrade)) out.push("D");
    else out.push("B");
  } else if (["A-", "B+"].includes(grade)) {
    if (["", "B0", "B-", "C+", "C0", "C-"].includes(prevGrade)) out.push("P");
    else out.push("D");
  } else if (["A0"].includes(grade)) {
    if (["", "A-", "B+", "B0", "B-", "C+", "C0", "C-"].includes(prevGrade)) out.push("E");
    else out.push("P");
  } else if (["A+"].includes(grade)) {
    out.push("E");
  }
  prevGrade = grade;
  stack.length = 0;
}
for (const token of S) {
  if (stack.length !== 0 && "ABC".includes(token)) calcGrade();
  stack.push(token);
}
calcGrade();

// output
return out.join("");
}
