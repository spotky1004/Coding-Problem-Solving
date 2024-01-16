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
check(`2 3
123
456`,
`64`);
check(`5 5
00000
00000
00200
00000
00000`,
`0`);
check(`6 7
3791178
1283252
4103617
8233494
8725572
2937261`,
`320356`);
check(`5 9
135791357
357913579
579135791
791357913
913579135`,
`9`);
check(`9 9
553333733
775337775
777537775
777357333
755553557
355533335
373773573
337373777
775557777`,
`-1`);
check(`9 9
257240281
197510846
014345401
035562575
974935632
865865933
684684987
768934659
287493867`,
`95481`);
check(`1 1
1`,
`1`);
check(`3 3
100
000
000`,
`100`);
check(`5 5
22222
21002
20002
20002
22222`,
`100`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M], ...nums] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const pows = new Set();
for (let i = 0; i < 100000; i++) {
  pows.add(i**2);
}

const board = nums.map(row => row.toString().padStart(M, "0"));
let maxNum = -1;
for (let i = 0; i < N; i++) {
  for (let j = 0; j < M; j++) {
    for (let di = -N; di <= N; di++) {
      for (let dj = -M; dj <= M; dj++) {
        if (di === 0 && dj === 0) continue;

        let ti = i, tj = j;
        const arr = [];
        while (
          0 <= ti && ti < N &&
          0 <= tj && tj < M
        ) {
          arr.push(board[ti][tj]);
          ti += di;
          tj += dj;
          const num = Number(arr.join(""));
          if (pows.has(num)) maxNum = Math.max(maxNum, num);
        }
      }
    }
  }
}


// output
return maxNum;
}
