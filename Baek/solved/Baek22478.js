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
check(`1`, `12Fizz4BuzzFizz78Fiz`);
check(`20`, `zzBuzz11Fizz1314Fizz`);
check(`10000000000`, `93FizzBuzz1418650796`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
function calcLen(x) {
  let accSpecial = 0n;
  let acc15 = 0n;
  let accCount = 0n;
  let max = 9n;
  let numLen = 1n;
  let len = 0n;
  while (true) {
    let curCount = x;
    if (curCount > max) curCount = max;

    const countSpecial = curCount / 3n + curCount / 5n - accSpecial;
    const count15 = curCount / 15n - acc15;
    const countNum = curCount - accCount - countSpecial + count15;
    if (
      countSpecial === 0n &&
      count15 === 0n &&
      countNum === 0n
    ) break;

    len += numLen * countNum + 4n * countSpecial;

    accCount = curCount;
    accSpecial += countSpecial;
    acc15 += count15;
    max = 10n * max + 9n;
    numLen++;
  }
  return len;
}

function getFBStr(x) {
  if (x % 15n === 0n) return "FizzBuzz";
  else if (x % 3n === 0n) return "Fizz";
  else if (x % 5n === 0n) return "Buzz";
  else return x.toString();
}

let l = 0n, r = 10n**17n;
while (l + 1n < r) {
  const m = (l + r) / 2n;
  if (N > calcLen(m)) l = m;
  else r = m;
}

const startNum = l;
const pos = calcLen(startNum) - BigInt(getFBStr(startNum).length);
let seq = "";
for (let x = startNum; x < startNum + 21n; x++) seq += getFBStr(x);
const offset = N - pos;

// output
return seq.slice(Number(offset) - 1, Number(offset) + 19);
}
