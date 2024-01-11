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
check(`4
1 1 1
1 -1 1
2 0 2
2 2 0
`,
`10`);
check(`0`,
`1`);
check(`2
1 2 0
2 0 2`,
`3`);
check(`2
1 -1 -1
2 -1 1`,
`3`);
check(`4
2 1 0
2 -1 0
2 0 1
2 0 -1`,
`9`);
check(`8
1 1 1
1 -1 1
1 1 0
1 0 1
2 2 0
2 -2 0
2 0 2
2 0 -2`,
`24`);
check(`8
1 1 1
1 -1 1
1 1 0
1 0 1
2 1 0
2 -1 0
2 0 1
2 0 -1`,
`24`);
check(`2
2 2 0
2 4 0`,
`3`);
check(`4
2 2 0
2 4 0
2 -1 1
2 -2 2`,
`9`);
check(`3
2 -10 -4
2 0 -4
2 4 -4`,
`6`);
check(`4
2 -10 -4
2 0 -4
2 4 -4
2 -4 -4`,
`8`);
check(`5
2 -10 -4
2 0 -4
2 4 -4
2 -4 -4
2 -2 -4`,
`10`);
check(`6
2 -10 -4
2 0 -4
2 4 -4
2 -4 -4
2 -2 -4
2 -4 -8`,
`15`);
check(`6
2 -10 -4
2 0 -4
2 4 -4
2 -4 -4
2 -2 -4
2 -4 -8
1 4 -7`,
`22`);
check(`5
1 1 1
1 -5 -5
2 2 2
2 2 2
2 2 2`,
`4`);
check(`4
2 2 2
2 -2 -2
1 -1 1
1 1 1`,
`8`);
check(`12
1 3 0
1 0 3
1 3 3
1 3 -3
1 1 3
1 -1 3
1 3 1
1 -3 1
2 3 0
2 0 3
2 -3 0
2 0 -3
`,
`48`);
check(`2
1 0 -1
1 0 5`,
`2`);
check(`8
2 4 4
2 -2 4
2 0 4
2 0 2
2 -4 2
2 -4 2
2 -4 0
2 -4 0
`,
`19`);
check(`2
1 -3 3
1 3 -3
1 1 -1
1 -1 1
1 1000000 -1000000`,
`2`);
check(`6
1 1 0
1 2 0
1 -2 0
1 -8 0
1 0 1
1 0 -5`,
`4`);
check(`18
2 2 2
2 -2 2
2 2 -2
2 -2 -2
2 4 4
2 -4 4
2 4 -4
2 -4 -4
2 0 4
2 4 0
2 0 -4
2 -4 0
1 2 0
1 0 2
1 2 2
1 2 -2
1 6 4
`,
`94`);
check(`4
2 2 2
2 4 4
2 -2 -2
2 -4 -4`,
`5`);
check(`4
2 -2 2
2 -4 4
2 2 -2
2 4 -4`,
`5`);
check(`3
2 1 1
2 1000000 999999
2 999999 1000000`,
`7`);
check(`6
2 8 6
2 6 -8
2 12 -4
2 -12 -6
2 -10 14
2 0 -2`,
`22`);
check(`8
1 6 3
1 10 -4
2 8 6
2 6 -8
2 12 -4
2 -12 -6
2 -10 14
2 0 -2`,
`37`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...shapes] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (shapes.flat().some(v => !Number.isInteger(v))) throw "???";

/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}



function compressPoint(x, y) {
  const gcdXY = gcd(x, y);
  x /= gcdXY;
  y /= gcdXY;

  if (x < 0) {
    x *= -1;
    y *= -1;
  }

  return [x, y];
}

const appearedLines = new Set();
const appearedCircles = new Set();

const uniqueLines = [];
const uniqueCircles = [];

for (const [, a, b] of shapes.filter(([type]) => type === 1)) {
  const [ap, bp] = compressPoint(a, b);

  const s = ap + "," + bp;
  // console.log(ap, bp, s);
  if (appearedLines.has(s)) continue;

  uniqueLines.push([ap, bp]);
  appearedLines.add(s);
}

for (const [, a, b] of shapes.filter(([type]) => type === 2)) {
  const s = a + "," + b;
  if (appearedCircles.has(s)) continue;

  uniqueCircles.push([a, b]);
  appearedCircles.add(s);
}

let areaCount = 1;
areaCount += Math.max(0, 2 * uniqueLines.length - 1);
areaCount += uniqueCircles.length;

const m = 10n**25n;

function bigSqrt(x) {
  let left = 0n, right = x * m;
  while (left < right) {
    const mid = (left + right) / 2n;
    const midPow = mid ** 2n;
    if (midPow > x) right = mid - 1n;
    else if (midPow < x) left = mid + 1n;
    else return mid;
  }
  return left;
}

for (let i = 0; i < uniqueCircles.length; i++) {
  const [a1, b1] = uniqueCircles[i];
  const x1 = a1 / 2;
  const y1 = b1 / 2;
  const r1 = Math.sqrt(x1 * x1 + y1 * y1);
  const circleMeetPoints = new Set();
  for (let j = i + 1; j < uniqueCircles.length; j++) {
    const [a2, b2] = uniqueCircles[j];
    const x2 = a2 / 2;
    const y2 = b2 / 2;
    const r2 = Math.sqrt(x2 * x2 + y2 * y2);
    if (compressPoint(a1, b1)+"" === compressPoint(a2, b2)+"") continue;

    const a = -2 * x1 + 2 * x2;
    const b = -2 * y1 + 2 * y2;
    const c = -(r1**2) + r2**2 + x1**2 - x2**2 + y1**2 - y2**2;

    const rx = x1;
    const ry = y1;
    let lx, ly;
    if (b !== 0) {
      lx = 1;
      ly = -a / b - c / b;
    } else {
      lx = -b / a - c / a;
      ly = 1;
    }
    const k = (rx * lx + ry * ly) / (lx * lx + ly * ly);

    let x = 2 * k * lx;
    let y = 2 * k * ly;

    if (Math.abs(x) < 1e-12) x = 0;
    if (Math.abs(y) < 1e-12) y = 0;

    circleMeetPoints.add(x.toFixed(12) + y.toFixed(12));
  }
  areaCount += circleMeetPoints.size;
}

for (let i = 0; i < uniqueLines.length; i++) {
  const [xl, yl] = uniqueLines[i];
  const points = new Set();
  for (let j = 0; j < uniqueCircles.length; j++) {
    const [xc, yc] = uniqueCircles[j];
    const dotLC = xl*xc + yl*yc;

    if (dotLC === 0) continue;

    const normL = Math.sqrt(xl * xl + yl * yl);
    const complr = dotLC / normL;
    points.add(complr.toFixed(11));
  }

  areaCount += points.size;
}

// output
return areaCount;
}
