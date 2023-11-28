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
check(`2
1 3
5 7`,
`2`);
check(`2
5 5
1 5`,
`1`);
check(`3
-1 1
19191919 7
100 3`,
`forever`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...butters] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
butters.sort((a, b) => a[0] - b[0]);

let minTime = Infinity;
for (let i = 1; i < N; i++) {
  const [ax, ah] = butters[i - 1];
  const [bx, bh] = butters[i];

  const dist = bx - ax - 1;
  if (dist >= (ah + bh) / 2 - 1) continue;

  const [l1, l2] = [(ah - 1) / 2, (bh - 1) / 2].sort((a, b) => a - b);
  let t;
  let newDist = dist - l1 * 2;
  if (newDist <= 0) {
    t = Math.floor(dist / 2);
  } else {
    t = l1 + newDist;
  }
  minTime = Math.min(minTime, t);
}

// output
return isFinite(minTime) ? minTime : "forever";
}
