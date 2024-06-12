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
check(`5
2 1
ik
3 1
ijk
3 1
kji
2 6
ji
1 10000
i`,
`Case #1: NO
Case #2: YES
Case #3: NO
Case #4: YES
Case #5: NO`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => !isNaN(parseInt(v)) ? Number(v) : v));

// code
const lookup = { "1": 1, i: 2, j: 3, k: 4 };
const table = [
  [1, 2, 3, 4],
  [2, -1, 4, -3],
  [3, -4, -1, 2],
  [4, 3, -2, -1]
];

const mul = (a, b) => Math.sign(a) * Math.sign(b) * table[Math.abs(a) - 1][Math.abs(b) - 1];
function calc(ijk) {
  const values = Array.from(ijk).map(v => lookup[v]);
  let out = 1;
  for (let i = 0; i < values.length; i++) out = mul(out, values[i]);
  return out;
}

const out = [];
loop: for (let tc = 0; tc < T; tc++) {
  const [L, X] = lines[2 * tc];
  const ijk = lines[2 * tc + 1][0].repeat(X);
  if (calc(ijk) === calc("ijk")) {
    for (let i = 1; i < 4 * L; i++) {
      if (
        calc(ijk.slice(0, i)) !== 2 ||
        calc(ijk.slice(i)) !== calc("jk")
      ) continue;
      for (let j = i + 1; j < ijk.length; j++) {
        if (
          calc(ijk.slice(i, j)) !== 3 ||
          calc(ijk.slice(j)) !== 4
        ) continue;
        out.push(`Case #${tc + 1}: YES`);
        continue loop;
      }
    }
  }
  out.push(`Case #${tc + 1}: NO`);
}

// output
return out.join("\n");
}
