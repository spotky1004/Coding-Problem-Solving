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
check(`3
10 100 50
50 80 40`,
`150`);
check(`3
30 80 40
30 80 40`,
`150`);
check(`3
10 20 30
40 50 60`,
`-150`);
check(`3
3 6 1
3 6 4`,
`70`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A, B] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
A.sort((a, b) => a - b);
B.sort((a, b) => b - a);

let money = 0;
const avaiables = [];
const cantWin = [];
for (let i = 0; i < N; i++) {
  const scoreB = B[i];
  while (A[A.length - 1] > scoreB) {
    avaiables.push(A.pop());
  }
  if (avaiables.length > 0) {
    money += 100;
    avaiables.pop();
  } else {
    cantWin.push(scoreB);
  }
}
avaiables.push(...A.reverse());
avaiables.reverse();

let drawCount = 0;
for (let i = 0; i < cantWin.length; i++) {
  if (cantWin[i] === avaiables[avaiables.length - 1]) {
    drawCount++;
    avaiables.pop();
  }
}

money += drawCount * 20;
money += (cantWin.length - drawCount) * (-50);

// output
return money;
}
