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
8 5
1 100
3 5`,
`3`);
check(`3
1 100
8 5
3 5`,
`2`);
check(`1
123 45`,
`0`);
check(`8
222 117
176 92
287 6
284 81
221 96
263 96
188 40
225 1`,
`4`);
check(`6
65 281
272 145
233 175
229 12
99 88
142 159`,
`6`);
check(`8
161 36
248 93
233 13
241 122
285 91
260 25
221 14
233 42`,
`3`);
check(`3
213 295
153 24
15 233`,
`3`);
check(`8
44 11
116 73
121 54
49 232
69 136
159 242
109 172
28 31`,
`8`);
check(`6
100 1
100 1
100 1
100 1
100 1
100 1`,
`0`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...eggs] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let maxBreak = 0;
function search(cur = 0, s = eggs.map(egg => egg[0]), broken = 0) {
  maxBreak = Math.max(maxBreak, broken);
  if (cur === N) return;

  if (s[cur] <= 0) {
    search(cur + 1, s, broken);
  } else {
    const w1 = eggs[cur][1];
    for (let i = 0; i < N; i++) {
      if (i === cur || s[i] <= 0) continue;
      const w2 = eggs[i][1];
      s[i] -= w1;
      s[cur] -= w2;
      let curBroken = (s[i] <= 0) + (s[cur] <= 0);

      search(cur + 1, s, broken + curBroken);

      s[i] += w1;
      s[cur] += w2;
    }
  }
}
search();

// output
return maxBreak;
}
