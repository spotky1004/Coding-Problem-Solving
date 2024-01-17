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
check(`4 4 2
1 2 3 4
5 6 7 8
9 10 11 12
13 14 15 16`,
`3 4 8 12
2 11 10 16
1 7 6 15
5 9 13 14`);
check(`5 4 7
1 2 3 4
7 8 9 10
13 14 15 16
19 20 21 22
25 26 27 28`,
`28 27 26 25
22 9 15 19
16 8 21 13
10 14 20 7
4 3 2 1`);
check(`2 2 3
1 1
1 1`,
`1 1
1 1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, R], ...A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const loops = Math.min(N, M) / 2;
for (let l = 0; l < loops; l++) {
  const loop = [];
  const points = [];
  for (let j = l; j < M - l; j++) {
    loop.push(A[l][j]);
    points.push([l, j]);
  }
  for (let i = 1 + l; i < N - l; i++) {
    loop.push(A[i][M - l - 1]);
    points.push([i, M - l - 1]);
  }
  for (let j = M - l - 2; j >= l; j--) {
    loop.push(A[N - l - 1][j]);
    points.push([N - l - 1, j]);
  }
  for (let i = N - l - 2; i >= l + 1; i--) {
    loop.push(A[i][l]);
    points.push([i, l]);
  }

  for (let p = 0; p < loop.length; p++) {
    const [i, j] = points[p];
    const ai = loop[(p + R) % loop.length];
    A[i][j] = ai;
  }
}

// output
return A.map(row => row.join(" ")).join("\n");
}
