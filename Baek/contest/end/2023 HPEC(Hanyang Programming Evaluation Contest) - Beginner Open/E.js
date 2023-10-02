const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
check(`2 2 3
100 200`,
`400`);
check(`4 3 20
-1 5 2 -5`,
`907326166`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[p, c, k], M] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
p = Number(p);
k = Number(k);
const m = 1_000_000_007n;

const D = [null];
const DExp = [null];
for (let i = 1; i < p; i++) {
  D.push(M[i] - M[i - 1]);
  DExp.push(Math.log(Number(M[i] - M[i - 1])));
}
const cPowers = [];
const cExp = [];
for (let i = 0; i < p; i++) {
  cPowers.push((c ** BigInt(i)) % m);
  cExp.push(Math.log(Number(c) ** i));
}
for (let i = p; i <= k; i++) {
  let sum = 0n;
  let expPlusSum = 0;
  let expMinusSum = 0;
  for (let j = 1; j < p; j++) {
    const value = cPowers[j] * D[i - j];
    sum -= value;
    const exp = cExp[j] + DExp[i - j];
    const sign = value > 0n ? 1 : -1;
    if (sign === 1) {
      if (expPlusSum === 0) {
        expPlusSum = DExp[i - j];
      } else {
        for (let k = 0; k < 10; k++) {
    
        }
      }
    }
  }
  D.push(sum);
  DExp.push(expSum);
}

// output
return ((D[k] > 0n ? D[k] : -D[k]) % m) + "";
}
