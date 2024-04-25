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
check(`1 5 2`, `14`);
check(`13 13 2`, `1`);
check(`10 99 1`, `450`);
check(`535 538 3`, `820`);
check(`100000 400000 6`, `5169721292`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[A, B, K]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const MAX_NUM = 4000000;

const nextNums = [];
for (let i = 0; i <= MAX_NUM; i++) {
  let sum = 0;
  let tmp = i;
  while (tmp > 0) {
    const digit = tmp % 10;
    sum += digit ** K;
    tmp = (tmp - digit) / 10;
  }
  nextNums.push(sum);
}

const isLoop = Array(MAX_NUM + 1).fill(false);
const minNums = Array.from({ length: MAX_NUM + 1 }, (_, i) => i);
loop: for (let i = 0; i <= MAX_NUM; i++) {
  if (nextNums[i] === i) {
    isLoop[i] = true;
    continue;
  }

  let a = nextNums[i], b = nextNums[nextNums[i]];
  while (a !== b) {
    a = nextNums[a], b = nextNums[nextNums[b]];
    if (isLoop[a]) continue loop;
  }

  const loopStart = a;
  let cur = a;

  let minNum = cur;
  cur = nextNums[cur];
  while (cur !== loopStart) {
    minNum = Math.min(minNum, cur);
    isLoop[cur] = true;
    cur = nextNums[cur];
  }

  cur = nextNums[cur];
  while (cur !== loopStart) {
    minNums[cur] = minNum;
    cur = nextNums[cur];
  }
}

let out = 0;
for (let i = A; i <= B; i++) {
  let minNum = minNums[i];
  let cur = i;
  while (!isLoop[cur]) {
    cur = nextNums[cur];
    minNum = Math.min(minNum, minNums[cur]);
  }
  out += minNum;
}

// output
return out;
}
