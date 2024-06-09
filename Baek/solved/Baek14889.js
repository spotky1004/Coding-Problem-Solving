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
check(`4
0 1 2 3
4 0 5 6
7 1 0 2
3 4 5 0`,
`0`);
check(`6
0 1 2 3 4 5
1 0 2 3 4 5
1 2 0 3 4 5
1 2 3 0 4 5
1 2 3 4 0 5
1 2 3 4 5 0`,
`2`);
check(`8
0 5 4 5 4 5 4 5
4 0 5 1 2 3 4 5
9 8 0 1 2 3 1 2
9 9 9 0 9 9 9 9
1 1 1 1 0 1 1 1
8 7 6 5 4 0 3 2
9 1 9 1 9 1 0 9
6 5 4 3 2 1 9 0`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...S] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} n 
 * @param {(comb: number[]) => void} callback 
 */
function combBruteSearcher(n, callback) {
  const maxBit = (1 << n) - 1;
  for (let i = 0; i <= maxBit; i++) {
    const comb = [];
    for (let b = 0; b < n; b++) if (i & (1 << b)) comb.push(b);
    callback(comb);
  }
}



let minDiff = Infinity;
combBruteSearcher(N, startTeam => {
  if (startTeam.length !== N / 2) return;
  const linkTeam = [];
  for (let i = 0; i < N; i++) if (!startTeam.includes(i)) linkTeam.push(i);

  let startPower = 0;
  for (let i = 0; i < startTeam.length; i++) {
    for (let j = 0; j < startTeam.length; j++) {
      startPower += S[startTeam[i]][startTeam[j]];
    }
  }

  let linkPower = 0;
  for (let i = 0; i < linkTeam.length; i++) {
    for (let j = 0; j < linkTeam.length; j++) {
      linkPower += S[linkTeam[i]][linkTeam[j]];
    }
  }

  const diff = Math.abs(startPower - linkPower);
  minDiff = Math.min(minDiff, diff);
});

// output
return minDiff;
}
