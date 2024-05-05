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
check(`2 2
01`,
`3`);
check(`4 3
010`,
`14`);
check(`1 30
111011100110101100101000000111`,
`0`);
check(`1 1
1`,
`1`);
check(`1 1
0`,
`0`);
check(`5 1
0`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const values = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
const [N, M] = values[0].map(BigInt);
const X = values[1][0];

// code
/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b, p) {
  let out = 1n;
  let curMul = a;
  let bin = 1n;
  while (bin <= b) {
    if (b & bin) {
      out = out*curMul % p;
    }
    bin *= 2n;
    curMul = curMul**2n % p;
  }
  return out;
}




const mod = 1_000_000_007n;
const totCount = N * divAndPow(2n, N - 1n, mod) % mod;
const zeroCount = totCount / 2n;
const oneCount = totCount - zeroCount;
const divInv = divAndPow(divAndPow(2n, N - 1n, mod), mod - 2n, mod);

let zeroValue = 0n;
let oneValue = 0n;
let curValue = 1n;
for (const Xi of [...X].reverse()) {
  if (Xi === "0") zeroValue += curValue;
  else oneValue += curValue;

  curValue = (curValue * 2n) % mod;
}

// output
return ((zeroValue * zeroCount * divInv + oneValue * oneCount * divInv) % mod).toString();
}
