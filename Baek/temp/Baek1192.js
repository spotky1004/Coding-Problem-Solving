const isDev = typeof window !== "undefined" || require("os").userInfo().username === "spotky";

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 0;
  function check(input, answer) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = process.memoryUsage().heapUsed / 1024;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((process.memoryUsage().heapUsed / 1024) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `Case ${CASE_NR}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `Case ${CASE_NR}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`4
0 7 1 6
1 5 0 6`,
`2\n8`);
check(`4
1 1 1 1
1 1 1 1`,
[`4\n1`, `1\n4`]);
check(`4
0 7 1 6
1 5 0 6`,
`2\n8`);
check(`4
0 1 1 1
1 1 0 1`,
[`3\n2`, `2\n3`]);
check(`10
10000 100 100 100 100 100 100 100 100 100
10000 10000 0 0 0 0 0 0 0 0`,
`801\n10001`);
}

function solve(input) {
// input
const [[N], l, r] = input
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const combCount = 1 << N;
const lMasks = Array(combCount).fill(Infinity);
const rMasks = Array(combCount).fill(Infinity);
const rMasks0 = Array(combCount).fill(Infinity);
lMasks[0] = l.reduce((a, b) => a + b, 0);
if (!l.includes(0)) lMasks[combCount - 1] = 1;
rMasks[0] = r.reduce((a, b) => a + b, 0);
rMasks[combCount - 1] = 1;
rMasks0[0] = r.reduce((a, b) => a + b, 0);
rMasks0[combCount - 1] = 1;

const lZeroMask = l.map((v, i) => v === 0 ? (1 << i) : 0).reduce((a, b) => a + b, 0);

loop: for (let i = 1; i < combCount - 1; i++) {
  let minCount = 1;
  for (let j = 0; j < N; j++) {
    const mask = 1 << j;
    if ((i & mask) !== 0) {
      if (l[j] === 0) continue loop;
      continue;
    }

    minCount += l[j];
  }
  lMasks[i] = minCount;
}

for (let i = 1; i < combCount - 1; i++) {
  let minCount = 1;
  let has0 = false;
  let hasNon0 = false;
  for (let j = 0; j < N; j++) {
    const mask = 1 << j;
    if ((i & mask) !== 0) {
      if (r[j] === 0) has0 = true;
      continue;
    }

    minCount += r[j];
    hasNon0 = true;
  }
  if (!has0) rMasks[i] = minCount;
  if (hasNon0) rMasks0[i] = minCount;
}
// console.log(rMasks, rMasks0);

let out = [lMasks[0], rMasks0[(combCount - 1) & (~lZeroMask)]];
let minCount = out[0] + out[1];
for (let i = 1; i < combCount; i++){
  const lCount = lMasks[i];
  let rMax = 0;

  for (let j = 0; j < N; j++) {
    const mask = 1 << j;
    if ((i & mask) === 0) continue;
    
    const rCount = rMasks[mask];
    rMax = Math.max(rMax, rCount);
  }
  
  // console.log(i.toString(2), lCount, rMax);
  if (lCount + rMax < minCount) {
    minCount = lCount + rMax;
    out = [lCount, rMax];
  }
}

// output
return out.join("\n");
}
