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
check(`3
6 1 4
4
2 1
2 3
1 2 3
2 3`,
`11
5
1
3
7`);
check(`5
1000000000 1000000000 1000000000 1000000000 1000000000
4
1 1 999999999
2 1
1 1 999999998
2 1`,
`5000000000
4999999999
4000000000
4000000000
4999999998`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A, [Q], ...queries] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
A.unshift(0);
const toggles = Array(N + 1).fill(true);

const out = [];
let aSum = A.reduce((a, b) => a + b, 0);
out.push(aSum);
for (const [type, i, x] of queries) {
  if (type === 1) {
    if (toggles[i]) {
      const diff = x - A[i];
      aSum += diff;
    }
    A[i] = x;
  } else if (type === 2) {
    if (toggles[i]) {
      aSum -= A[i];
    } else {
      aSum += A[i];
    }
    toggles[i] = !toggles[i];
  }
  out.push(aSum);
}

// output
return out.join("\n");
}
