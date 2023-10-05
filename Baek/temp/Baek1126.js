const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`3
3
2
1
2`,
`1/3`);
check(`5
10
100
1000
10000
100000
10`,
`1/1`);
check(`5
11
101
1001
10001
100001
10`,
`0/1`);
check(`9
13
10129414190271203
102
102666818896
1216
1217
1218
101278001
1000021412678412681
21`,
`5183/36288`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n")
  .map(BigInt);

// codeconst isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`3
2 3 5`,
`5`);
check(`3
10 9 2`,
`-1`);
check(`2
11 11`,
`11`);
check(`9
14 3 20 15 15 14 24 23 15`,
`64`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], H] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const max = Math.floor(H.reduce((a, b) => a + b, 0) / 2) + 1;
const avaiables1 = Array(max).fill(-1);
avaiables1[0] = -2;
for (let i = 0; i < N; i++) {
  const h = H[i];
  for (let j = 0; j < max; j++) {
    if (
      avaiables1[j] === -1 ||
      avaiables1[j] === i
    ) continue;
    const next = j + h;
    if (
      avaiables1[next] !== -1 ||
      next > max
    ) continue;
    avaiables1[next] = i;
  }
}
avaiables1[0] = -1;

const avaiables2 = Array(max).fill(-1);
for (let i = 0; i < max; i++) {
  if (avaiables1[i] === -1) continue;
  let curHeight = i;
  const used = [];
  while (avaiables1[curHeight] !== -1) {
    const curIdx = avaiables1[curHeight];
    used.push(curIdx);
    curHeight -= H[curIdx];
  }
}

// output
return "answer";
}

// output
return "answer";
}
