const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
check(`11
HabcYaUUHYU
2 3`,
`7
2`);
check(`15
HHHUUYYHHUYHYUU
9 2`,
`Nalmeok
4`);
check(`1
a
10000 0`,
`10000
I love HanYang University`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
input = input
  .trim()
  .split("\n");
const N = Number(input[0]);
const S = Array.from(input[1]);
const [D, M] = input[2].split(" ").map(Number);

// code
let e = 0;
let smallCount = 0;
const letterIdx = { "H": 0, "Y": 1, "U": 2 };
const letterCounts = [0, 0, 0];
for (let i = 0; i < N; i++) {
  const c = S[i];
  if (c.toUpperCase() !== c) {
    smallCount++;
  } else {
    e += Math.min(D * smallCount, M + D);
    letterCounts[letterIdx[c]]++;

    smallCount = 0;
  }
}
e += Math.min(D * smallCount, M + D);

const hyu = Math.min(...letterCounts);

// output
return `${e || "Nalmeok"}\n${hyu || "I love HanYang University"}`;
}
