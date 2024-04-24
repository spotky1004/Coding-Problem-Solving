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
check(`2 4 2
3 1
2 2`,
`YES
LA`);
check(`3 4 5
1 2
4 5
0 2`,
`YES
LAL`);
check(`3 4 5
1 2
4 -1
1 5`,
`NO`);
check(`1 0 1
-1 1`,
`NO`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, A, L], ...attacks] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const dpArua = [];
dpArua.push(Array(L + 1).fill(null));
dpArua[0][L] = A;
const dpReceived = [];
dpReceived.push(Array(L + 1).fill(null));
dpReceived[0][L] = "";

for (let i = 0; i < N; i++) {
  const [Xi, Yi] = attacks[i];
  const prevAruaDp = dpArua[i];
  const curAruaDp = Array(L + 1).fill(null);
  const curReceivedDp = Array(L + 1).fill(null);
  dpArua.push(curAruaDp);
  dpReceived.push(curReceivedDp);
  for (let l = 0; l <= L; l++) {
    if (prevAruaDp[l] === null) continue;

    const prevArua = prevAruaDp[l];
    if (
      Xi !== -1 &&
      (
        Yi === -1 ||
        Xi <= prevArua
      )
    ) {
      const newArua = Math.max(0, prevArua - Xi);
      if (curAruaDp[l] === null || curAruaDp[l] < newArua) {
        curAruaDp[l] = newArua;
        curReceivedDp[l] = "A";
      }
    }
    if (Yi !== -1) {
      const newLife = l - Yi;
      if (newLife > 0 && (curAruaDp[newLife] === null || curAruaDp[newLife] < prevArua)) {
        curAruaDp[newLife] = prevArua;
        curReceivedDp[newLife] = "L";
      }
    }
  }
}

let curLife = dpArua[N].findIndex(v => v !== null);
if (curLife <= 0) return "NO";
const out = [];
for (let i = N; i >= 1; i--) {
  const [Xi, Yi] = attacks[i - 1];
  const received = dpReceived[i][curLife];
  out.push(received);
  if (received === "L") curLife += Yi;
}

// output
return `YES\n${out.reverse().join("")}`;
}
