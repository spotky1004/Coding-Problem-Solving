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
// check(`5`, `2`);
// check(`2349`, `8`);
check(`3859485`, `4`);
check(`3859234234234234485`, `4`);
// check(`3859400`, `2`);
// check(`10`, `8`);
// check(`120`, `2`);
// let fact = 1n;
// for (let i = 1n; i <= 20n; i++) {
//   fact *= i;
//   while (fact % 10n === 0n) fact /= 10n;
//   check(i.toString(), (fact % 10n).toString(), `${i}! -> ${fact % 10n}`);
// }
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const N = BigInt(input);

// code
const mulValues = [1, 1, 1, 3, 1, 1, 3, 7, 1, 9];
const NDigits = N.toString();
let out = 1;
let mulCount = 0;
for (let i = NDigits.length - 1; i >= 0; i--) {
  const digit = Number(NDigits[i]);
  for (let j = 1; j <= digit; j++) {
    out *= mulValues[j] * 7 ** mulCount;
    while (out % 10 === 0) out /= 10;
    out %= 10;
  }
  mulCount = (mulCount * 2 + 1) % 4;
}

let twoCount = 0n;
let fiveCount = 0n;
for (let i = N; i > 0n; ) {
  i /= 2n;
  twoCount += i;
}
for (let i = N; i > 0n; ) {
  i /= 5n;
  fiveCount += i;
}

console.log(out, twoCount, fiveCount);
if (twoCount > 0n) {
  out *= [2, 4, 8, 6][(twoCount - fiveCount - 1n) % 4n];
  out %= 10;
}

// output
return out;
}
