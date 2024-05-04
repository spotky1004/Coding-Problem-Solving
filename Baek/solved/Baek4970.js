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
check(`(P*Q)
(--R+(P*Q))
(P*-P)
2
1
(-1+(((---P+Q)*(--Q+---R))*(-R+-P)))
.`,
`3
11
0
27
0
7`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const exprs = input
  .trim()
  .split("\n");

// code
/**
 * @param {number} x 
 */
const not = (x) => 2 - x;
/**
 * @param {number} x 
 * @param {number} y 
 */
const mul = (x, y) => Math.min(x, y);
/**
 * @param {number} x 
 * @param {number} y 
 */
const add = (x, y) => Math.max(x, y);
/**
 * @param {string} expr 
 * @param {number} P 
 * @param {number} Q 
 * @param {number} R 
 * @returns {number} 
 */
const parse = (expr, P, Q, R) => {
  const stack = [];
  for (const token of expr) {
         if (token === "0") stack.push(0);
    else if (token === "1") stack.push(1);
    else if (token === "2") stack.push(2);
    else if (token === "P") stack.push(P);
    else if (token === "Q") stack.push(Q);
    else if (token === "R") stack.push(R);
    else if (token === "-") stack.push("-");
    else if (token === "*") stack.push("*");
    else if (token === "+") stack.push("+");
    else if (token === "(") stack.push("(");
    else if (token === ")") {
      const r = stack.pop();
      const o = stack.pop();
      const l = stack.pop();
      stack.pop();
      if (o === "*") stack.push(mul(l, r));
      else if (o === "+") stack.push(add(l, r));
    }

    while (
      stack[stack.length - 2] === "-" &&
      typeof stack[stack.length - 1] === "number"
    ) {
      const x = stack.pop();
      stack.pop();
      stack.push(not(x));
    }
  }
  return stack[0];
}

const out = [];
for (const expr of exprs) {
  if (expr === ".") break;
  let count = 0;
  for (let P = 0; P <= 2; P++) {
    for (let Q = 0; Q <= 2; Q++) {
      for (let R = 0; R <= 2; R++) {
        if (parse(expr, P, Q, R) === 2) count++;
      }
    }
  }
  out.push(count);
}

// output
return out.join("\n");
}
