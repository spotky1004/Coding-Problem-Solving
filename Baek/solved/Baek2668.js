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
check(`7
3
1
1
5
5
4
6`,
`3
1
3
5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [N, ...nums] = input
  .trim()
  .split("\n")
  .map(Number)

// code
for (let i = 0; i < N; i++) nums[i]--;

const out = [];
const cycleChecked = Array(N).fill(false);
loop: for (let i = 0; i < N; i++) {
  if (cycleChecked[i]) continue;
  const visited = Array(N).fill(false);
  const cycle = [];
  let cur = i;
  while (true) {
    if (visited[cur] === true) {
      if (cur !== i) continue loop;
      break;
    }
    cycle.push(cur);
    visited[cur] = true;
    cur = nums[cur];
  }
  
  for (const num of cycle) {
    cycleChecked[num] = true;
    out.push(num);
  }
}

// output
return `${out.length}\n${out.sort((a, b) => a - b).map(n => n + 1).join("\n")}`;
}
