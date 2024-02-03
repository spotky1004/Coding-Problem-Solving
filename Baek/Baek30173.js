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
10 2
40 5`,
`11
12`);
check(`5
1000 2
1000 3
1000 4
1000 5
1000 6
1000 7
1000 8
1000 9`,
``);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const aSum = (x) => x * (x + 1) / 2;

const out = [];
console.log(`           ${Array.from({ length: 100 }, (_, i) => (i + 1) % 10).join(" ")}`);
console.log("");
for (const [n, k] of cases) {
  const sumU = [];
  let sumUIdx = 0;
  let uIdx = 1;
  for (let i = 0; i < 1000; i++) {
    const l = uIdx;
    let r = l + k - 1;
    let minus = 0;
    while (sumU[sumUIdx] <= r) {
      minus += sumU[sumUIdx];
      sumUIdx++;
      r++;
    }
    const sum = aSum(r) - aSum(l - 1) - minus;
    uIdx = r + 1;
    sumU.push(sum);
  }
  
  const diffs = [];
  for (let i = 1; i < sumU.length; i++) {
    diffs.push(sumU[i] - sumU[i - 1]);
  }
  console.log(`k = ${k} -> { ${diffs.map(v => v - k**2).slice(0, 100).map(v => v === 0 ? "." : v).join(" ")} }`);
}

// output
return "answer";
}
