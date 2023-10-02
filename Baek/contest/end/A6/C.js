const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString();
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
check(`3 2 3
1
2
3
900 30
1800 40
2700 50`,
`110`);
check(`2 2 3
10
20
8999 10
17999 100
1 1`,
`110`);
check(`2 2 3
9999
9999
8999 10
17999 100
1 1`,
`222`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], ...datas] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const D = datas.splice(0, N).flat();
const Q = datas;

const toUse = D.sort((a, b) => b - a).slice(0, M);
const maxBit = (1 << K) - 1;
let out = 0;
for (const d of toUse) {
  let maxCoin = 0;
  loop: for (let i = 1; i <= maxBit; i++) {
    let coin = 0;
    let timeLeft = 15 * 60;
    for (let j = 0; j < K; j++) {
      const mask = 1 << j;
      const timeUse = Math.ceil(Q[j][0] / d);
      if ((i & mask) === 0) continue;
      if (timeUse > timeLeft) continue loop;
      timeLeft -= timeUse;
      coin += Q[j][1];
    }

    if (maxCoin > coin) continue;
    maxCoin = coin;
  }

  out += maxCoin;
}

// output
return out;
}
