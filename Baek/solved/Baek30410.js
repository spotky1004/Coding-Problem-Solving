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
check(`4
1 1 2 2
`, `4`);
check(`8
2 2 2 2 2 2 2 2
`, `16`);
check(`9
1 1 1 2 1 1 1 1 1
`, `8`);
check(`1
2
`, `2`);
check(`14
1 1 2 1 1 2 1 1 2 1 1 2 1 1
`, `16`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const compA = [0, 0];
let j = 0;
for (let i = 0; i < N; i++) {
  const Ai = A[i];
  if (Ai !== (j % 2) + 1) {
    j++;
    if (j % 2 === 0) compA.push(0, 0);
  }
  compA[j]++;
}

for (let i = 0; i < compA.length; i += 2) {
  if (compA[i] % 2 !== 0) continue;
  compA[i + 1] += compA[i] / 2;
  compA[i] = 0;
  if (i !== 0) {
    compA[i - 1] += compA[i + 1];
    compA.splice(i, 2);
    i -= 2;
  }
}

let maxHeight = 0;
for (let i = 0; i < compA.length; i++) {
  let height = 0;
  if (i % 2 === 0) {
    height = 2**Math.floor(Math.log2(compA[i]));
  } else {
    const twoCount =
      Math.floor((compA[i - 1] ?? 0) / 2) +
      compA[i] +
      Math.floor((compA[i + 1] ?? 0) / 2);
    height = 2**Math.floor(Math.log2(twoCount) + 1);
  }
  maxHeight = Math.max(maxHeight, height);
}

// output
return maxHeight;
}
