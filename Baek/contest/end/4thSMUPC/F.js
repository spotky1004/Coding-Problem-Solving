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
check(`9 5
-1 -1
-1 0
-1 1
1 0
1 1
1 2
2 2
2 4
3 3
0 3
1 1
4 0
4 4
3 6`,
`3`);
check(`5 3
0 1
0 3
0 4
0 5
0 1000000000
1 0
0 6
0 2`,
`4`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const fruits = lines.splice(0, Number(N));
const points = lines;

// code
/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

const E10 = 10n ** 10n;
function calcSlope(x, y) {
  const sign = Math.sign(x) * Math.sign(y);
  x = Math.abs(x);
  y = Math.abs(y);
  const div = gcd(x, y);

  return BigInt(sign) * (E10 * BigInt(x / div) + BigInt(y / div));
}

const xFruits = [[], []];
const yFruits = [[], []];
/** @type {Map<bigint, [l: number[], r: number[]]>} */
const slopeFruits = new Map();
for (const [fx, fy] of fruits) {
  if (fx === 0) {
    if (fy > 0) xFruits[1].push(fy);
    else xFruits[0].push(-fy);
  } else if (fy === 0) {
    if (fx > 0) yFruits[1].push(fx);
    else yFruits[0].push(-fx);
  } else {
    const slope = calcSlope(fx, fy);
    if (!slopeFruits.has(slope)) slopeFruits.set(slope, [[], []]);
    if (fy > 0) slopeFruits.get(slope)[1].push(fy);
    else slopeFruits.get(slope)[0].push(-fy);
  }
}
for (const [, arrs] of slopeFruits) {
  arrs[0].sort((a, b) => a - b);
  arrs[1].sort((a, b) => a - b);
}

let max = 0;
for (const [ex, ey] of points) {
  let searchArr, searchVal;
  if (ex === 0) {
    if (ey > 0) {
      searchArr = xFruits[1];
      searchVal = ey;
    } else {
      searchArr = xFruits[0];
      searchVal = -ey;
    }
  } else if (ey === 0) {
    if (ex > 0) {
      searchArr = yFruits[1];
      searchVal = ex;
    } else {
      searchArr = yFruits[0];
      searchVal = -ex;
    }
  } else {
    const slope = calcSlope(ex, ey);
    if (!slopeFruits.has(slope)) continue;
    if (ey > 0) {
      searchArr = slopeFruits.get(slope)[1];
      searchVal = ey;
    } else {
      searchArr = slopeFruits.get(slope)[0];
      searchVal = -ey;
    }
  }
  if (
    searchArr.length === 0 ||
    searchVal < searchArr[0]
  ) continue;

  let l = 1, r = searchArr.length + 1;
  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);
    if (searchArr[m - 1] <= searchVal) l = m;
    else r = m;
  }
  max = Math.max(max, l);
  // console.log(ex, ey, l, searchArr, searchVal);
}

// output
return max;
}
