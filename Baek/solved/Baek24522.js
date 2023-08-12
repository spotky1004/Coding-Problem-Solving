const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`6 4
0 0
5 0
5 3
8 3
8 6
3 6
1 4
2 4
2 1
5 1`,
`2`);
check(`8 3
6 -3
-2 -3
-2 1
0 1
0 -1
2 -1
2 3
-6 3
0 1
0 0
1 0`,
`6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...points] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {string} str 
*/
function makeLps(str) {
  const lps = Array(str.length);
  lps[0] = 0;

  let i = 1;
  let j = 0;
  while (i < str.length) {
    if (str[i] === str[j]) {
      lps[i] = ++j;
      i++;
    } else {
      if (j !== 0) j = lps[j - 1];
      else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

/**
 * @param {string} str 
 * @param {string} pattern 
*/
function kmp(str, pattern) {
  const lps = makeLps(pattern);
  const matchIdxes = [];

  let i = 0;
  let j = 0;
  while (i < str.length) {
    if (str[i] === pattern[j]) {
      i++;
      j++;
    }
    if (j === pattern.length) {
      matchIdxes.push(i - j);
      j = lps[j - 1];
    } else if (i < str.length && str[i] !== pattern[j]) {
      if (j === 0) i++;
      j = lps[j - 1] ?? 0;
    }
  }
  return matchIdxes;
}



function parseShape(points) {
  const shape = [];
  let prevDirection = null;
  let prevPoint = points[0];
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    const dx = x - prevPoint[0];
    const dy = y - prevPoint[1];
    let curDirection = -1;
    if (dy > 0) curDirection = 0;
    else if (dx > 0) curDirection = 1;
    else if (dy < 0) curDirection = 2;
    else if (dx < 0) curDirection = 3;
    
    const len = Math.abs(dx !== 0 ? dx : dy);
    if (prevDirection !== null) {
      if (
        (prevDirection === 0 && curDirection === 3) ||
        prevDirection - curDirection === 1
      ) shape.push("L");
      else shape.push("R");
    }
    shape.push(len);
    
    prevDirection = curDirection;
    prevPoint = [x, y];
  }

  return shape.join("");
}
function invertShape(shape) {
  let numberStack = [];
  const out = [];
  for (let i = 0; i < shape.length; i++) {
    const char = shape[i];
    if (!isNaN(parseInt(char))) {
      numberStack.push(char);
    } else {
      out.push(numberStack.join(""));
      numberStack = [];
      if (char === "R") out.push("L");
      else out.push("R");
    }
  }
  out.push(numberStack.join(""));
  out.reverse();
  return out.join("");
}
function parseNumber(str, index, direction) {
  const stack = [];
  while (!isNaN(parseInt(str[index]))) {
    stack.push(str[index]);
    index += direction;
  }
  if (direction === -1) stack.reverse();
  return parseInt(stack.join(""));
}
const snakeShape = parseShape(points.slice(0, N));
const triggerShape = parseShape(points.slice(N));
const triggerShapeInv = invertShape(triggerShape);

const triggerStartLen = parseNumber(triggerShape, 0, 1);
const triggerEndLen = parseNumber(triggerShape, triggerShape.length - 1, -1);
const startStrLen = triggerStartLen.toString().length;
const endStrLen = triggerEndLen.toString().length;
const sideLen = startStrLen + endStrLen;

const matchs1 = kmp(snakeShape, triggerShape.slice(startStrLen, triggerShape.length - endStrLen));
const matchs2 = triggerShape !== triggerShapeInv ?
  kmp(snakeShape, triggerShapeInv.slice(endStrLen, triggerShape.length - startStrLen)) :
  [];

let count = 0;
for (const matchIdx of matchs1) {
  const lLen = parseNumber(snakeShape, matchIdx - 1, -1);
  const rLen = parseNumber(snakeShape, matchIdx + triggerShape.length - sideLen, 1);

  if (
    lLen >= triggerStartLen &&
    rLen >= triggerEndLen
  ) count++;
}
for (const matchIdx of matchs2) {
  const lLen = parseNumber(snakeShape, matchIdx - 1, -1);
  const rLen = parseNumber(snakeShape, matchIdx + triggerShape.length - sideLen, 1);

  if (
    lLen >= triggerEndLen &&
    rLen >= triggerStartLen
  ) count++;
}

// output
return count;
}
