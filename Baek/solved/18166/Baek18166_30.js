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
check(`1 19
1 + (2 - 3) * 4 + 5`,
`2`);
check(`1 17
(2 * (2 + 3)) / 2`,
`5`)
check(`1 13
1 / 2 + 3 / 6`,
`1`);
check(`1 5
1 / 0`,
`19981204`);
check(`1 17
(1 + 2) * (3 + 4)`,
`21`);
check(`1 5
0 - 1`,
`1000000006`);
check(`1 ?
5 / 10 * 2`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const expr = input
  .split("\n")
  .map(line => Array.from(line));
const [R, C] = expr.shift().join("").split(" ").map(Number);

// code
/**
 * @param {bigint} a 
 * @param {bigint} b 
 * @param {bigint} p
*/
function divAndPow(a, b, p) {
  if (b === 0n) return 1n;
  let out = 1n;
  let curMul = a;
  const loopCount = BigInt(Math.ceil(Math.log2(Number(b))) + 1);
  for (let i = 0n; i < loopCount; i++) {
    if (b & 1n << i) {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}



const p = 1_000_000_007n;

const calcOrder = [];
const opStack = [];
const opTypes = "+-*/()";
const opLevels = new Map([
  ["(", 3],
  ["+", 1],
  ["-", 1],
  ["*", 1],
  ["/", 1]
]);
const vals = expr[0]
  .join("")
  .replace(/(\(|\))/g, (_, m) => ` ${m} `)
  .replace(/^ +| +$/g, "")
  .replace(/ +/g, " ")
  .split(" ");
for (const val of vals) {
  if (opTypes.includes(val)) {
    if (val === "(") {
      opStack.push(val);
    } else if (val === ")") {
      while (opStack[opStack.length - 1] !== "(") {
        calcOrder.push(opStack.pop());
      }
      opStack.pop();
    } else {
      const lv = opLevels.get(val);
      while (opStack.length > 0 && opLevels.get(opStack[opStack.length - 1]) <= lv) {
        calcOrder.push(opStack.pop());
      }
      opStack.push(val);
    }
  } else {
    calcOrder.push(BigInt(val) % p);
  }
}
calcOrder.push(...opStack.reverse());

const valsStack = [];
for (const val of calcOrder) {
  if (opTypes.includes(val)) {
    let result;
    const [b, a] = [valsStack.pop(), valsStack.pop()];
    if (val === "+") result = a + b;
    if (val === "-") result = a - b;
    if (val === "*") result = a * b;
    if (val === "/") result = b !== 0n ? a * divAndPow(b , p - 2n, p) : 19981204n;
    valsStack.push(((result % p) + p) % p);
  } else {
    valsStack.push(val);
  }
}

// output
return valsStack[0];
}
