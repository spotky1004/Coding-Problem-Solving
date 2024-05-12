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
check(`3 1
ABC X
A Y
CDE Z
ABCDE`,
`YXZ`);
check(`3 3
KPSC WELCOME
KOOK HELLOWORLD
KOOKMIN FIGHTING
KPSCWELCOME
CONTEXT
KOOKMINUNIVERSITY`,
`WELCOME
-1
HELLOWORLDFIGHTING`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
const words = lines.splice(0, N);
const S = lines;

// code
const wordsMap = new Map(words);
const out = [];
for (const [Si] of S) {
  const len = Si.length;
  let ans = "";
  for (let i = 0; i < len; i++) {
    for (let j = 1; j <= Math.min(10, len - i); j++) {
      const part = Si.slice(i, i + j);
      if (wordsMap.has(part)) ans += wordsMap.get(part);
    }
  }
  if (ans === "") out.push("-1");
  else out.push(ans);
}

// output
return out.join("\n");
}
