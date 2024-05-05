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
check(`2 2
1 1 1 1 1 1 1 1 1 1 1
2 1 1 1 1 1 1 1 1 1 1`,
`1023
1022
1022
1022
1022
1022
1022
1022
1022
1022
1022`);
check(`5 4
5 1 2 4 1 2 1 1 2 1 2
3 2 1 2 4 2 2 2 1 5 3
5 1 5 4 1 2 1 1 2 1 2
3 2 1 2 4 2 4 2 1 5 3`,
`9765627
9765625
9765625
9765625
9765625
9765625
9765624
9765625
9765625
9765625
9765627`);
// check(`32 7
// 21 5 15 12 29 9 18 17 20 16 3
// 23 11 26 19 25 7 24 14 31 8 5
// 21 5 15 12 31 9 18 17 20 16 3
// 10 1 6 3 22 28 2 13 4 27 1
// 10 2 6 3 22 28 2 13 4 27 1
// 23 11 23 19 25 7 24 14 31 8 5
// 32 30 21 5 15 12 3 10 1 6 12`,
// `1125899906842630
// 1125899906842629
// 1125899906842631
// 1125899906842631
// 1125899906842629
// 1125899906842631
// 1125899906842629
// 1125899906842631
// 1125899906842628
// 1125899906842631
// 1125899906842629`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K], ...items] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const baseCount = BigInt(N) ** 10n - 2n * BigInt(K);
const add = Array(11).fill(0n);

function hashPos(pos) {
  let out = 0;
  for (let i = 0; i < 11; i++) {
    out += (pos[i] - 1) * N**i;
  }
  return out;
}
const hashed = new Set(items.map(hashPos));
for (const item of items) {
  for (let i = 0; i < 11; i++) {
    if (item[i] === 1 || item[i] === N) add[i] += 2n;

    if (item[i] !== 1) {
      item[i]--;
      if (hashed.has(hashPos(item))) add[i]++;
      item[i]++;
    }
    if (item[i] !== N) {
      item[i]++;
      if (hashed.has(hashPos(item))) add[i]++;
      item[i]--;
    }
  }
}

const out = [];
for (let i = 0; i < 11; i++) out.push(baseCount + add[i] / 2n);

// output
return out.join("\n");
}
