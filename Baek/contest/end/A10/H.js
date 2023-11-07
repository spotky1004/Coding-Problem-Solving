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
check(`4 5 3
1 2 3 4 5
5 2 1 4 6
0 2 4 2 1
0 0 2 1 7
3 3
1 4
3 1`,
`13
4
6`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, Q], ...datas] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));
const board = datas.splice(0, N);
const queries = datas;

// code
const suffixArr = [];
for (let i = 0; i < N; i++) {
  const row = [];
  suffixArr.push(row);
  for (let j = 0; j < M; j++) {
    row.push(board[i][j]);
    if (i !== 0) row[j] += suffixArr[i - 1][j];
  }
}
for (let i = 1; i < N; i++) {
  for (let j = 1; j < M; j++) {
    suffixArr[i][j] += suffixArr[i - 1][j - 1];
  }
}

const out = [];
for (const [Wi, Pi] of queries) {
  out.push(suffixArr[Wi - 1][Pi - 1]);
}

// output
return out.join("\n");
}
