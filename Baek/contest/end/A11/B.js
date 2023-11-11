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
check(`4 4
1 P 1
2 P 1
2 M 0
3 M 1`,
`1 3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N, M], ...results] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
[N, M] = [N, M].map(Number);
results = results.map(r => [Number(r[0]), r[1], Number(r[2])]);

// code
const plants = Array(N + 1).fill(0);
for (const [a, b, c] of results) {
  if (b === "P") {
    if (plants[a] !== -1 && c === 1) plants[a] |= 1;
    else plants[a] = -1;
  } else if (b === "M") {
    if (plants[a] !== -1 && c === 0) plants[a] |= 2;
    else plants[a] = -1;
  }
}

const minCount = plants.slice(1).filter(v => v === 3).length;
const maxCount = plants.slice(1).filter(v => v >= 0).length;

// output
return `${minCount} ${maxCount}`;
}
