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
check(`1
10 2 1
10`,
`6`);
check(`1
10 2 2
1`,
`10`);
check(`4
100 3 3
20
100
20
20`,
`69`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N], [H, D, K], ...R] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
R = R.flat();

// code
let minDamage = 0;
function search(turnCount = 0, dist = D, health = H, supriseState = 0) {
  if (turnCount === N) {
    minDamage = Math.max(minDamage, health);
    return;
  }

  const Ri = supriseState !== 1 ? R[turnCount] : 0;
  if (supriseState === 1) supriseState = -1;

  search(
    turnCount + 1,
    dist,
    health - Math.max(0, Math.floor((Ri - dist) / 2)),
    supriseState
  );
  search(
    turnCount + 1,
    dist + K,
    health - Math.max(0, Ri - dist - K),
    supriseState
  );
  if (supriseState !== -1) search(
    turnCount + 1,
    dist,
    health - Math.max(0, Ri - dist),
    1
  );
}
search();

// output
return minDamage <= 0 ? -1 : minDamage;
}
