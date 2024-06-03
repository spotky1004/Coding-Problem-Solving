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
check(`6
1 * 2 / 3 / 4 * 5 * 6`,
`mint chocolate`);
check(`6
1 * 2 / 3 / 4 / 5 * 6`,
`toothpaste`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], terms] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => !isNaN(parseInt(v)) ? Number(v) : v));

// code
/**
 * @param {number} n 
 */
function genMinFactors(n) {
  const minFactors = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 4; i <= n; i += 2) {
    minFactors[i] = 2;
  }
  for (let i = 3; i <= n; i += 2) {
    if (minFactors[i] !== i) continue;
    let mul = i * 3;
    while (mul <= n) {
      if (minFactors[mul] === mul) minFactors[mul] = i;
      mul += i * 2;
    }
  }
  return minFactors;
}



const minFactors = genMinFactors(1e5);
const factorCounts = Array(1e5 + 1).fill(0);

for (let i = 0; i < N; i++) {
  const op = i !== 0 ? terms[2 * i - 1] : "*";
  const opDelta = op === "*" ? 1 : -1;
  let value = Math.abs(terms[2 * i]);
  while (value > 1) {
    factorCounts[minFactors[value]] += opDelta;
    value /= minFactors[value];
  }
}

// output
return factorCounts.every(v => v >= 0) || terms.includes(0) ? "mint chocolate" : "toothpaste";
}
