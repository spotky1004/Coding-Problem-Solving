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
check(`8
5 -3
10 1
-1 2
1 7
2 1
2 5
5 4
6 -1
3 2`,
`-1 2
2 1
5 -3
6 -1
10 1
5 4
2 5
1 7`);
check(`5
1 1
2 2
3 3
4 4
5 5
0 0`,
`1 1
2 2
3 3
4 4
5 5`);
check(`9
1 1
2 2
3 3
4 4
5 5
7 7
8 8
9 9
10 10
6 6`,
`5 5
4 4
3 3
2 2
1 1
7 7
8 8
9 9
10 10`);
check(`4
-2 0
-1 0
1 0
2 0
0 0`,
`-1 0
-2 0
1 0
2 0`);
check(`4
0 1
0 -1
0 2
0 -2
0 0`,
`0 -1
0 -2
0 1
0 2`);

const perm = (str) => {
  const lines = str.split("\n");
  return Array.from({ length: lines.length }, (_, i) => lines.slice(lines.length - i).concat(lines.slice(0, lines.length - i)).join("\n"));
}

check(`4
0 1
-1 0
0 -1
1 0
0 0`,
perm(`-1 0
0 -1
1 0
0 1`));
check(`8
-1 -1
-1 1
1 -1
-1 0
0 1
1 0
0 -1
1 1
0 0`,
perm(`-1 0
-1 -1
0 -1
1 -1
1 0
1 1
0 1
-1 1`));
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...ppl] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));
/** @type {[number, number]} */
const [xh, yh] = ppl.pop();

// code
/**
 * @param {bigint} a 
 * @param {bigint} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}

/**
 * @param {bigint} x 
 */
function abs(x) {
  return x > 0n ? x : -x;
}

/**
 * @param {bigint} x 
 */
function sign(x) {
  return Math.sign(Number(x));
}

function rad(x, y) {
  return 
}

function compPoint(a, b) {
  const [ax, ay] = a;
  const [bx, by] = b;
  const gcdA = abs(gcd(ax, ay));
  const gcdB = abs(gcd(bx, by));
  const [axp, ayp] = [ax / gcdA, ay / gcdA];
  const [bxp, byp] = [bx / gcdB, by / gcdB];
  
  const radDiff = Math.atan2(Number(ayp), Number(axp)) - Math.atan2(Number(byp), Number(bxp));
  if (radDiff !== 0) return radDiff;
  
  if (axp === bxp && ayp === byp) {
    const xDiff = abs(ax) - abs(bx);
    if (xDiff !== 0n) return sign(xDiff);
    return sign(abs(ay) - abs(by));
  }
  if (ay < 0n && by > 0n) return -1;
  if (ay > 0n && by < 0n) return 1;
  if (ax < 0n && bx > 0n) return -1;
  return 1;
}

// output
return ppl
  .map(p => [p[0] - xh, p[1] - yh])
  .sort(compPoint)
  .map(p => [p[0] + xh, p[1] + yh].join(" "))
  .join("\n");
}
