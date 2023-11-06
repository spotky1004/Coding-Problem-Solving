const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky1004");

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
check(`5
1 2 2 2 6
`,
`Yes
3 1 4 5 2`);
check(`5
1 4 4 4 6
`,
`No`);
check(`5
2 2 2 2 6`,
`Yes
1 3 4 5 2`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], B] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const used = Array(N + 1).fill(false);
const seq = Array(N).fill(-1);
if (B[0] !== 1) {
  if (B[0] === 2) {
    seq[0] = 1;
    used[1] = true;
  } else {
    return "No";
  }
}
for (let i = 1; i < N; i++) {
  if (B[i] !== B[i - 1]) {
    const toUse = B[i - 1];
    seq[i] = toUse;
    used[toUse] = true;
  }
}

const seen = Array(N + 1).fill(false);
let mex = 1;
if (seq[0] === 1) mex = 2;
let j = 1;
for (let i = 0; i < N; i++) {
  if (seq[i] !== -1) {
    seen[seq[i]] = true;
    while (seen[mex] === true) mex++;
    if (mex !== B[i]) return "No";
    continue;
  }
  while (used[j] === true) j++;
  seq[i] = j;
  used[j] = true;
  seen[j] = true;
  while (seen[mex] === true) mex++;
  if (mex !== B[i]) return "No";
}

// output
return `Yes\n${seq.join(" ")}`;
}
