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
check(`seungjaehwang
4
a 0 5
a 0 6
a 6 10
a 7 10`,
`0
1
2
1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[S], [Q], ...queries] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => !isNaN(parseInt(v)) ? Number(v) : v));

// code
/**
 * @param {number[]} str
*/
function alphaSum(str, alpha) {
  if (str.length === 0) return [];

  const sumArr = [Number(str[0] === alpha)];
  for (let i = 1; i < str.length; i++) sumArr[i] = sumArr[i - 1] + (str[i] === alpha);
  return sumArr;
}

const sums = [];
for (let i = 0; i < 26; i++) sums.push(alphaSum(S, (i + 10).toString(36)));

const out = [];
for (const [a, l, r] of queries) {
  const sum = sums[parseInt(a, 36) - 10];
  out.push(sum[r] - (l !== 0 ? sum[l - 1] : 0));
}

// output
return out.join("\n");
}
