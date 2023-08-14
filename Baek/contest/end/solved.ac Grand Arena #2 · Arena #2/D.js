const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
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
check(`6
3 1 2 4 1 5`,
`8`);
check(`9
1 1 1 3 3 3 1 1 1`,
`11`);
check(`8
2 2 2 1 1 1 1 1`,
`11`);
check(`5
2 2 2 2 2`,
`9`);
check(`15
3 3 1 1 1 3 3 1 1 1 3 3 1 1 1`,
`26`);
check(`12
3 3 1 1 3 3 1 1 3 3 1 1`,
`16`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N], A] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let newA = [];
let oneCount = 0;
for (let i = 0; i < N; i++) {
  if (A[i] !== 1) {
    if (oneCount !== 0) {
      newA.push(-oneCount);
      oneCount = 0;
    }
    newA.push(A[i]);
  } else {
    oneCount++;
  }
}
if (oneCount !== 0) {
  newA.push(-oneCount);
}
A = newA;

let count = N;
for (let len = 2; len <= Math.min(A.length, 50); len++) {
  let sumMin = 0, sumMax = 0, mul = 1;

  for (let i = 0; i < len; i++) {
    if (A[i] > 0) {
      sumMax += A[i];
      sumMin = sumMax;
      mul *= A[i];
    } else {
      sumMin++;
      sumMax += -A[i];
    }
  }
  if (A[0] < 0) {
    sumMin -= -A[0] - 1;
  }
  if (sumMin <= mul && mul <= sumMax) count++;

  for (let i = len; i < A.length; i++) {
    sumMin = sumMax;
    if (A[i - len] > 0) {
      sumMax -= A[i - len];
      sumMin = sumMax;
      mul /= A[i - len];
    } else {
      sumMax -= -A[i - len];
      sumMin = sumMax;
    }

    let mCount = 0;
    if (A[i] > 0) {
      sumMax += A[i];
      sumMin = sumMax;
      mul *= A[i];
    } else {
      sumMin++;
      sumMax += -A[i];
      mCount++;
    }
    if (A[i - len + 1] < 0) {
      sumMin -= -A[i - len + 1] - 1;
      mCount++;
    }
    
    if (sumMin <= mul && mul <= sumMax) {
      if (mCount === 2) {
        count += Math.min(mul - (sumMax + A[i - len + 1] + A[i]), -A[i - len + 1] + 1, -A[i] + 1, sumMax - sumMin + 1) - 1;
      } else {
        count++;
      }
    }
  }
}

// output
return count;
}
