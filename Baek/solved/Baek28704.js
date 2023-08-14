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
check(`11
3 3 1 1 3 3 1 3 3 1 1`,
`13`);
check(`1
1`,
`1`);
check(`2
1 1`,
`2`);
check(`9
2 2 2 2 2 1 1 1 1`,
`14`);
check(`8
1 1 1 3 3 1 1 1`,
`12`);
check(`5
1 3 1 3 1`,
`6`);
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
const maxSum = BigInt(A.reduce((a, b) => a + Math.abs(b), 0));
for (let len = 2; len <= Math.min(A.length, 38); len++) {
  let sumMin = 0, sumMax = 0, prod = 1n;
  let mCount = 0;

  for (let i = 0; i < len; i++) {
    mCount = 0;

    if (A[i] > 0) {
      sumMax += A[i];
      sumMin = sumMax;
      prod *= BigInt(A[i]);
    } else {
      sumMin++;
      sumMax += -A[i];
      mCount++;
    }
  }
  if (A[0] < 0) {
    sumMin -= -A[0] - 1;
    mCount++;
  }
  if (
    prod <= maxSum &&
    sumMin <= Number(prod) && Number(prod) <= sumMax
  ) {
    if (mCount === 2) {
      const leftOneCount = -A[0];
      const rightOneCount = -A[len - 1];
      const need = Number(prod) - (sumMax - leftOneCount - rightOneCount);
      count += Math.min(need - 1, leftOneCount, rightOneCount, leftOneCount + rightOneCount - need + 1);
    } else {
      count++;
    }
  }

  for (let i = len; i < A.length; i++) {
    sumMin = sumMax;
    if (A[i - len] > 0) {
      sumMax -= A[i - len];
      sumMin = sumMax;
      prod /= BigInt(A[i - len]);
    } else {
      sumMax -= -A[i - len];
      sumMin = sumMax;
    }

    mCount = 0;
    if (A[i] > 0) {
      sumMax += A[i];
      sumMin = sumMax;
      prod *= BigInt(A[i]);
    } else {
      sumMin++;
      sumMax += -A[i];
      mCount++;
    }
    if (A[i - len + 1] < 0) {
      sumMin -= -A[i - len + 1] - 1;
      mCount++;
    }
    
    if (
      prod <= maxSum &&
      sumMin <= Number(prod) && Number(prod) <= sumMax
    ) {
      if (mCount === 2) {
        const leftOneCount = -A[i - len + 1];
        const rightOneCount = -A[i];
        const need = Number(prod) - (sumMax - leftOneCount - rightOneCount);
        count += Math.min(need - 1, leftOneCount, rightOneCount, leftOneCount + rightOneCount - need + 1);
      } else {
        count++;
      }
    }
  }
}

// output
return count;
}
