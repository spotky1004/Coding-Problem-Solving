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
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`3 9 1`, `4`);
check(`5 10 3`, `5`);
check(`7 8 7`, `15`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[A, B, K]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let dividers = [];
const sum = A + B;
const sqrtSum = Math.ceil(Math.sqrt(sum));
for (let i = 0; i < sqrtSum; i++) {
  if (sum % i !== 0) continue;

  dividers.push(i);
  dividers.push(sum / i);
}
dividers = [...new Set(dividers)].sort((a, b) => b - a);

for (const divider of dividers) {
  const minChange = Math.min(
    A - divider * Math.floor(A / divider),
    Math.abs(A - divider * Math.ceil(A / divider)),
    B - divider * Math.floor(B / divider),
    Math.abs(B - divider * Math.ceil(B / divider))
  );
  if (minChange <= K) return divider;
}

// output
return 1;
}
