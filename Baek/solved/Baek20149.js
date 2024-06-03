
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
check(`1 1 5 5
1 5 5 1`,
`1
3 3`);
check(`1 1 5 5
6 10 10 6`,
`0`);
check(`1 1 5 5
5 5 1 1`,
`1`);
check(`1 1 5 5
3 3 5 5`,
`1`);
check(`1 1 5 5
3 3 1 3`,
`1
3 3`);
check(`1 1 5 5
5 5 9 9`,
`1
5 5`);
check(`1 1 5 5
5 5 9 9`,
`1
5 5`);
check(`1 1 5 5
6 6 9 9`,
`0`);
check(`1 1 5 5
5 5 1 5`,
`1
5 5`);
check(`1 1 5 5
6 6 1 5`,
`0`);
check(`2 8 9 23
1 10 9 8`,
`1
2.7313432835820897 9.5671641791044770`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[x1, y1, x2, y2], [x3, y3, x4, y4]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * 0: don't intersection
 * 1: one intersection; that point is an endpoint of segment
 * 2: one intersection; that point isn't an endpoint of segment
 * 3: infinite amount of intersection
 * @param {bigint} x1 
 * @param {bigint} y1 
 * @param {bigint} x2 
 * @param {bigint} y2 
 * @param {bigint} x3 
 * @param {bigint} y3 
 * @param {bigint} x4 
 * @param {bigint} y4 
 * @returns {[type: 0 | 1 | 2 | 3, x: null | undefined | number, y: null | undefined | number]} 
 */
function segmentIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  /**
   * @param {bigint} a 
   * @param {bigint} b 
   * @returns {bigint} 
   */
  const gcd = (a, b) => {
    if (a < 0n) a = -a;
    if (b < 0n) b = -b;
    return b ? gcd(b, a % b) : a;
  }

  /**
   * @param {bigint} x1 
   * @param {bigint} y1 
   * @param {bigint} x2 
   * @param {bigint} y2 
   * @param {bigint} y 
   * @returns {[val: bigint, div: bigint]} 
   */
  const calcX = (x1, y1, x2, y2, y) => {
    let val = (x2 - x1) * (y - y1) + x1 * (y2 - y1);
    let div = y2 - y1;
    if (div < 0n) val = -val, div = -div;
    const g = gcd(val, div);
    return [val / g, div / g];
  };
  /**
   * @param {bigint} x1 
   * @param {bigint} y1 
   * @param {bigint} x2 
   * @param {bigint} y2 
   * @param {bigint} x 
   * @returns {[val: bigint, div: bigint]} 
   */
  const calcY = (x1, y1, x2, y2, x) => {
    let val = (y2 - y1) * (x - x1) + y1 * (x2 - x1);
    let div = x2 - x1;
    if (div < 0n) val = -val, div = -div;
    const g = gcd(val, div);
    return [val / g, div / g];
  };
  /**
   * @param {bigint} a 
   * @param {bigint} b 
   * @returns {bigint} 
   */
  const max = (a, b) => a > b ? a : b;
  /**
   * @param {bigint} a 
   * @param {bigint} b 
   * @returns {bigint} 
   */
  const min = (a, b) => a > b ? b : a;

  if (x1 === x2 && x3 === x4) {
    if (x1 !== x3) return [0, undefined, undefined];
    const proj = [
      [min(y1, y2), max(y1, y2)],
      [min(y3, y4), max(y3, y4)],
    ].sort((a, b) => Number(a[0] - b[0]));
    if (proj[0][1] < proj[1][0]) return [0, undefined, undefined];
    if (proj[0][1] === proj[1][0]) return [1, Number(x1), Number(proj[0][1])];
    return [3, null, null];
  }
  if (y1 === y2 && y3 === y4) {
    if (y1 !== y3) return [0, undefined, undefined];
    const proj = [
      [min(x1, x2), max(x1, x2)],
      [min(x3, x4), max(x3, x4)],
    ].sort((a, b) => Number(a[0] - b[0]));
    if (proj[0][1] < proj[1][0]) return [0, undefined, undefined];
    if (proj[0][1] === proj[1][0]) return [1, Number(proj[0][1]), Number(y1)];
    return [3, null, null];
  }
  if (x1 === x2) {
    const [s, sDiv] = calcY(x3, y3, x4, y4, x1);
    if (
      min(x3, x4) <= x1 && x1 <= max(x3, x4) &&
      min(y1, y2) * sDiv <= s && s <= max(y1, y2) * sDiv
    ) {
      if (
        sDiv === 1n &&
        (y1 === s || y2 === s || x3 === x1 || x4 === x1)
      ) return [1, Number(x1), Number(s)]
      return [2, Number(x1), Number(s) / Number(sDiv)];
    }
    return [0, undefined, undefined];
  }
  if (x3 === x4) {
    const [s, sDiv] = calcY(x1, y1, x2, y2, x3);
    if (
      min(x1, x2) <= x3 && x3 <= max(x1, x2) &&
      min(y3, y4) * sDiv <= s && s <= max(y3, y4) * sDiv
    ) {
      if (
        sDiv === 1n &&
        (y3 === s || y4 === s || x1 === x3 || x2 === x3)
      ) return [1, Number(x3), Number(s)]
      return [2, Number(x3), Number(s) / Number(sDiv)];
    }
    return [0, undefined, undefined];
  }
  if (y1 === y2) {
    const [s, sDiv] = calcX(x3, y3, x4, y4, y1);
    if (
      min(y3, y4) <= y1 && y1 <= max(y3, y4) &&
      min(x1, x2) * sDiv <= s && s <= max(x1, x2) * sDiv
    ) {
      if (
        sDiv === 1n &&
        (x1 === s || x2 === s || y3 === y1 || y4 === y1)
      ) return [1, Number(s), Number(y1)]
      return [2, Number(s) / Number(sDiv), Number(y1)];
    }
    return [0, undefined, undefined];
  }
  if (y3 === y4) {
    const [s, sDiv] = calcX(x1, y1, x2, y2, y3);
    if (
      min(y1, y2) <= y3 && y3 <= max(y1, y2) &&
      min(x3, x4) * sDiv <= s && s <= max(x3, x4) * sDiv
    ) {
      if (
        sDiv === 1n &&
        (x3 === s || x4 === s || y1 === y3 || y2 === y3)
      ) return [1, Number(s), Number(y3)]
      return [2, Number(s) / Number(sDiv), Number(y3)];
    }
    return [0, undefined, undefined];
  }
  if (
    (y2 - y1) * (x4 - x3) === (y4 - y3) * (x2 - x1) &&
    (y3 - y1) * (x4 - x2) === (y4 - y2) * (x3 - x1) &&
    (y4 - y1) * (x3 - x2) === (y3 - y2) * (x4 - x1)
  ) {
    const proj = [
      [min(y1, y2), max(y1, y2)],
      [min(y3, y4), max(y3, y4)],
    ].sort((a, b) => Number(a[0] - b[0]));
    if (proj[0][1] < proj[1][0]) return [0, undefined, undefined];
    if (proj[0][1] === proj[1][0]) {
      const [x, xDiv] = calcX(x1, y1, x2, y2, proj[0][1]);
      return [1, Number(x) / Number(xDiv), Number(proj[0][1])];
    }
    return [3, null, null];
  }
  if ((y2 - y1) * (x4 - x3) === (y4 - y3) * (x2 - x1)) return [0, undefined, undefined];
  
  let x = y1 * x2 * (x3 - x4) + x1 * y2 * (x4 - x3) + (x2 - x1) * (x4 * y3 - x3 * y4);
  let xDiv = (y1 * (x3 - x4) + y2 * (x4 - x3) + (x2 - x1) * (y3 - y4));
  if (xDiv < 0n) x = -x, xDiv = -xDiv;
  const xg = gcd(x, xDiv);
  x /= xg, xDiv /= xg;

  if (
    max(min(x1, x2), min(x3, x4)) * xDiv <= x && x <= min(max(x1, x2), max(x3, x4)) * xDiv
  ) {
    if (xDiv === 1n) {
      const [y, yDiv] = calcY(x1, y1, x2, y2, x);
      if (
        yDiv === 1n &&
        (
          (x1 === x && y1 === y) ||
          (x2 === x && y2 === y) ||
          (x3 === x && y3 === y) ||
          (x4 === x && y4 === y)
        )
      ) return [1, Number(x), Number(y)];
    }
    const nx = Number(x) / Number(xDiv);
    const nx1 = Number(x1), ny1 = Number(y1), nx2 = Number(x2), ny2 = Number(y2);
    return [2, nx, (ny2 - ny1) * (nx - nx1) / (nx2 - nx1) + ny1];
  }
  return [0, undefined, undefined];
}

const [type, ...point] = segmentIntersection(...[x1, y1, x2, y2, x3, y3, x4, y4].map(BigInt));
const out = [
  Math.sign(type)
];
if (typeof point[0] === "number") out.push(point.map(v => Number(v.toFixed(15))).join(" "));
return out.join("\n");
}
