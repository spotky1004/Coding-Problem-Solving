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
check(`5
4
3 0 1 2
4
1 3 3 3
4
3 1 2 3
3
3 3 3
1
3`,
`1
1
2
3
-1`);
check(`2
1
1
4
0 3 3 3`,
`0
2`
);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const out = [];
for (let i = 0; i < T; i++) {
  const [N] = lines[2 * i];
  const A = lines[2 * i + 1];

  const counts = [0, 0, 0, 0];
  for (const Ai of A) {
    counts[Ai]++;
  }

  if (counts[3] === 0) {
    out.push(0);
  } else if (counts[1] === 0 && counts[2] === 0) {
    if (counts[3] % 2 === 1) {
      if (counts[0] >= 1) {
        out.push(2);
      } else if (counts[3] === 1) {
        out.push(-1);
      } else {
        out.push(3);
      }
    } else {
      out.push(1);
    }
  } else {
    let coverStart = Infinity;
    let coverEnd = -Infinity;
    let coverSum = 0;
    let coverSumTmp = 0;
    for (let i = 0; i < N; i++) {
      const Ai = A[i];
      if (Ai === 3) coverStart = Math.min(coverStart, i);

      if (isFinite(coverStart)) {
        coverSumTmp ^= Ai;
        if (Ai === 3) {
          coverSum ^= coverSumTmp;
          coverSumTmp = 0;
          coverEnd = Math.max(coverEnd, i);
        }
      }
    }

    if (coverSum !== 3) {
      out.push(1);
    } else {
      if (A.slice(0, coverStart).concat(A.slice(coverEnd + 1)).every(v => v === 0)) {
        out.push(2);
      } else {
        out.push(1);
      }
    }
  }
}

// output
return out.join("\n");
}
