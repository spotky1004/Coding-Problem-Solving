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
check(`4 4
----
----
----
----`,
`4`);
check(`6 9
-||--||--
--||--||-
|--||--||
||--||--|
-||--||--
--||--||-`,
`31`);
check(`7 8
--------
|------|
||----||
|||--|||
||----||
|------|
--------`,
`13`);
check(`10 10
||-||-|||-
||--||||||
-|-|||||||
-|-||-||-|
||--|-||||
||||||-||-
|-||||||||
||||||||||
||---|--||
-||-||||||`,
`41`);
check(`6 6
-||--|
||||||
|||-|-
-||||-
||||-|
||-||-`,
`19`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n");

const [N, M] = lines.shift().split(" ").map(Number);
const board = lines.map(row => Array.from(row));

// code

let count = 0;
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    const cell = board[i][j];
    if (cell === "x") continue;
    if (cell === "-") {
      let x = j;
      while (board[i][x] === "-") {
        board[i][x] = "x";
        x++;
      }
    } else {
      let y = i;
      while ((board[y] ?? [])[j] === "|") {
        board[y][j] = "x";
        y++;
      }
    }
    count++;
  }
}

// output
return count;
}
