const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 0;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`4
4
2 2 -100 -100
5
-2 3 -2 3 -2
6
-1 1 -1 1 -1 2
7
-3 1 -4 5 -9 2 -6`,
`YES
YES
YES
NO`, "예제 입력 1");
check(`3
4
1 -1 1 -1
4
2 -1 2 -1
8
1 -3 1 -2 1 -1 2 -1`,
`NO
YES
YES`, "대충 엣지 케이스");
check(`4
1
0
2
0 0
5
1 0 1 0 -1
2
-100000 100001`,
`NO
NO
YES
YES`, "더 엣지 케이스");
check(`1
16
-101 100 -1 1 -1 -1 1 -1 -1 -1 1 -1 -1 -1 1 -1`,
`YES`, "더 더 엣지 케이스");
}

function solve(input) {
// input
const [[T], ...cases] = input
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const out = [];
for (let t = 0; t < T * 2; t += 2) {
  const [N] = cases[t];
  const A = cases[t + 1];

  const merged = [];
  let negSum = 0;
  for (let i = 0; i < N; i++) {
    const n = A[i];
    if (n > 0) {
      if (negSum < 0) merged.push(negSum);
      negSum = 0;
      merged.push(n);
    } else {
      negSum += n;
    }
  }
  if (negSum < 0) merged.push(negSum);
  
  let posCount = 0;
  let negCount = 0;
  let posLeft = 0;
  for (let i = 0; i < merged.length; i++) {
    const n = merged[i];
    if (n > 0) {
      if (posLeft > 0) posLeft = 0;
      posLeft += n;
      posCount++;
    } else if (n < 0) {
      if (posLeft > -n) {
        posLeft = 0;
      } else if (merged[i + 1] > -n) {
        posLeft = n;
      } else {
        negCount++;
      }
    }
    console.log(i, n, posLeft, posCount, negCount);
  }
  console.log(posCount, negCount);
  out.push(posCount > negCount ? "YES" : "NO");
}

// output
return out.join("\n");
}
