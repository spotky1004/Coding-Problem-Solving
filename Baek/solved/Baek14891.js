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
check(`10101111
01111101
11001110
00000010
2
3 -1
1 1`,
`7`);
check(`11111111
11111111
11111111
11111111
3
1 1
2 1
3 1`,
`15`);
check(`10001011
10000011
01011011
00111101
5
1 1
2 1
3 1
4 1
1 -1`,
`6`);
check(`10010011
01010011
11100011
01010101
8
1 1
2 1
3 1
4 1
1 -1
2 -1
3 -1
4 -1`,
`5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[s1], [s2], [s3], [s4], [K], ...queries] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const states = [s1, s2, s3, s4].map(v => v.toString().padStart(8, "0"));

// code
const getLState = (idx) => states[idx][6];
const getRState = (idx) => states[idx][2];
const isDif = (l, r) => getRState(l) !== getLState(r);

const rotateL = (idx) => (states[idx] = states[idx].slice(1) + states[idx][0]);
const rotateR = (idx) => (states[idx] = states[idx][7] + states[idx].slice(0, -1));
const rotate = (idx, dir) => dir === 1 ? rotateR(idx) : rotateL(idx);

for (const [idx, dir] of queries) {
  if (idx === 1) {
    if (isDif(0, 1)) {
      if (isDif(1, 2)) {
        if (isDif(2, 3)) {
          rotate(3, -dir);
        }
        rotate(2, dir);
      }
      rotate(1, -dir);
    }
    rotate(0, dir);
  }

  if (idx === 2) {
    if (isDif(0, 1)) {
      rotate(0, -dir);
    }
    if (isDif(1, 2)) {
      if (isDif(2, 3)) {
        rotate(3, dir);
      }
      rotate(2, -dir);
    }
    rotate(1, dir);
  }

  if (idx === 3) {
    if (isDif(1, 2)) {
      if (isDif(0, 1)) {
        rotate(0, dir);
      }
      rotate(1, -dir);
    }
    if (isDif(2, 3)) {
      rotate(3, -dir);
    }
    rotate(2, dir);
  }

  if (idx === 4) {
    if (isDif(2, 3)) {
      if (isDif(1, 2)) {
        if (isDif(0, 1)) {
          rotate(0, -dir);
        }
        rotate(1, dir);
      }
      rotate(2, -dir);
    }
    rotate(3, dir);
  }
}

// output
return states.reduce((a, b, i) => a + (1 << i)*b[0], 0);
}
