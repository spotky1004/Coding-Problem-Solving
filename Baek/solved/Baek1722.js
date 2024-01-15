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
check(`4
1 3`,
`1 3 2 4`);
check(`4
2 1 3 2 4`,
`3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], [type, ...params]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// code
const fact = [1n];
for (let i = 1n; i <= N; i++) {
  fact.push(fact[i - 1n] * i);
}
if (type === 1n) {
  const left = Array.from({ length: Number(N) }, (_, i) => i + 1);
  const out = [];

  let k = params[0] - 1n;
  for (let i = 0n; i < N; i++) {
    const div = fact[N - i - 1n];
    const toPush = left.splice(Number(k / div), 1)[0];
    k %= div;
    out.push(toPush);
  }

  return out.join(" ");
} else if (type === 2n) {
  const left = Array.from({ length: Number(N) }, (_, i) => i + 1);
  
  let k = 1n;
  for (let i = 0n; i < N; i++) {
    const mul = fact[N - i - 1n];
    const idx = left.findIndex(v => v === Number(params[i]));
    k += mul * BigInt(idx);
    left.splice(idx, 1);
  }

  return k.toString();
}

// output
return "hi!";
}
