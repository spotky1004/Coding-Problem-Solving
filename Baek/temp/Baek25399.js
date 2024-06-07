const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  const count = Number(out.split("\n")[0]);
  const X = out.split("\n").slice(1).map(v => v.split(" ")[1]).map(Number);
  if (X.length !== new Set(X).size || X.length !== count || X.some(v => 1 > v || v > 1e12 || !Number.isInteger(v))) throw "??";
  const ans = out.split("\n").slice(1).map(v => v.split(" ")).reduce((a, b) => a + (b[0] === "+" ? 1n : -1n) * BigInt(b[1]) ** 2n, 0n);
  if (ans !== BigInt(input)) throw "??";
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);

    console.log(out);
    let isAC = true;
    const count = Number(out.split("\n")[0]);
    const X = out.split("\n").slice(1).map(v => v.split(" ")[1]).map(Number);
    if (X.length !== new Set(X).size || X.length !== count || X.some(v => 1 > v || v > 1e12 || !Number.isInteger(v))) isAC = false;
    const ans = out.split("\n").slice(1).map(v => v.split(" ")).reduce((a, b) => a + (b[0] === "+" ? 1n : -1n) * BigInt(b[1]) ** 2n, 0n);
    if (ans !== BigInt(input)) isAC = false;

    if (isAC) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${input}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${input}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`-999999999998`);
// check(`16`);
// check(`1217`);
// check(`-30`);
// check(`30`);
// check(`0`);
// check(`-2`);
// check(`2`);
// check(`3`);
// check(`256`);
// check(`20`);
// check(`3`);
// check(`108`);
// check(`18`);
// const ables = new Set();
// for (let i = 1; i < 100; i++) {
//   for (let j = 1; j < 100; j++) {
//     if (i === j) continue;
//     ables.add(i*i + j*j);
//     ables.add(-(i*i) + j*j);
//     ables.add(i*i + -(j*j));
//     ables.add(-(i*i) + -(j*j));
//   }
// }
// [...ables].sort((a, b) => a - b).forEach(v => check(v.toString()));
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
if (N === 0) return `3\n+ 5\n- 4\n- 3`;
if (N > 0 && Math.round(Math.sqrt(N)) ** 2 === N) return `1\n+ ${Math.round(Math.sqrt(N))}`;
if (N < 0 && Math.round(Math.sqrt(-N)) ** 2 === -N) return `1\n- ${Math.round(Math.sqrt(-N))}`;
if (N === 2) return `3\n+ 5\n- 12\n+ 11`;
if (N === -2) return `3\n- 5\n+ 12\n- 11`;
if (((N % 2) + 2) % 2 === 1) {
  if (N > 0) return `2\n+ ${(N + 1) / 2}\n- ${(N - 1) / 2}`;
  if (N < 0) return `2\n+ ${(-N - 1) / 2}\n- ${(-N + 1) / 2}`;
}
for (let a = -2e7; a <= 2e7; a++) {
  let b, sign;

  b = Math.round(Math.sqrt(Math.abs(Math.abs(N) - a * a)));
  sign = Math.sign(a) * (a * a) + (b * b) === N ? 1 : -1;
  if (
    Math.sign(a) * (a * a) + sign * (b * b) === N &&
    Math.abs(a) !== b &&
    b !== 0 &&
    a !== 0
  ) return `2\n${a > 0 ? "+" : "-"} ${Math.abs(a)}\n${sign === 1 ? "+" : "-"} ${b}`;
}
if (N > 0) return `3\n+ ${N / 2}\n- ${(N - 2) / 2}\n+ 1`;
if (N < 0) return `3\n+ ${(-N - 2) / 2}\n- ${-N / 2}\n- 1`;
}
