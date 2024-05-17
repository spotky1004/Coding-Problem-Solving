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
check(`3
a ^b&(b|a)~b^ a
a^b&(b|a)(a^(b&(b|a)))
~~~~z~~z`,
`Data set 1: Different
Data set 2: Equivalent
Data set 3: Equivalent`);
check(`9
aa
a~a
a(a)
((a))(((((a)))))
a|ba|b
ab|~~~a
b|(~a)(~a)|b
b|(~a)~(a&(~b))
()()
`,
`Data set 1: Equivalent
Data set 2: Different
Data set 3: Equivalent
Data set 4: Equivalent
Data set 5: Equivalent
Data set 6: Different
Data set 7: Equivalent
Data set 8: Equivalent
Data set 9: Equivalent`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [N, ...cases] = input
  .trim()
  .split("\n");

// code
const opLevels = new Map([
  ["~", 4], ["&", 3],
  ["^", 2], ["|", 1],
  ["(", 0]
]);
function convertExpr(expr) {
  // ~ -> & -> ^ -> |
  const out = [];
  const stack = [];
  for (const token of expr) {
    if ("a" <= token && token <= "z") {
      out.push(token);
      while (stack[stack.length - 1] === "~") out.push(stack.pop());
      continue;
    }
    if (token === ")") {
      while (stack[stack.length - 1] !== "(") out.push(stack.pop());
      stack.pop();
      while (stack[stack.length - 1] === "~") out.push(stack.pop());
      continue;
    }
    if (token === "(") {
      stack.push(token);
      continue;
    }
    while (
      opLevels.get(token) <= opLevels.get(stack[stack.length - 1]) &&
      stack[stack.length - 1] !== "~"
    ) {
      out.push(stack.pop());
    }
    stack.push(token);
  }
  while (stack.length > 0) out.push(stack.pop());
  return out.join("");
}

/**
 * @param {string} expr 
 * @param {Map<string, number>} values 
 */
function parse(expr, values) {
  const stack = [];
  for (const token of expr) {
    if ("a" <= token && token <= "z") stack.push(values.get(token));
    else if (token === "~") stack.push(~stack.pop());
    else if (token === "|") stack.push(stack.pop() | stack.pop());
    else if (token === "&") stack.push(stack.pop() & stack.pop());
    else if (token === "^") stack.push(stack.pop() ^ stack.pop());
  }
  return stack[0];
} 

const out = [];
let caseNr = 1;
for (const rawExpr of cases) {
  const filtered = rawExpr.replace(/[^a-z|^&~()]/g, "");
  const exprs = filtered
    .replace(/([a-z])([a-z])/g, "$1,$2")
    .replace(/(\)|[a-z])(~|\()/g, "$1,$2")
    .split(",")
    .map(convertExpr);
  const variables = [...new Set(Array.from(rawExpr.replace(/[^a-z]/g, "")))];
  let isEq = true;
  if (exprs.length === 2) {
    for (let mask = (1 << variables.length) - 1; mask >= 0; mask--) {
      const values = new Map([...variables].map((v, i) => [v, mask & (1 << i) ? 1 : 0]));
      if (parse(exprs[0], values) !== parse(exprs[1], values)) {
        isEq = false;
        break;
      }
    }
  } else {
    isEq = false;
  }
  out.push(`Data set ${caseNr}: ${isEq ? "Equivalent" : "Different"}`);
  caseNr++;
}

// output
return out.join("\n");
}
