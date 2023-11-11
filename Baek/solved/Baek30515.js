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
check(`10
1 5 5 5 3 2 1 1 10 2
6
1 1 10 3
1 2 7 5
2 3 5
1 1 3 5
2 4 7
1 1 10 1`,
`1
3
1
2`);
check(`1
5
5
1 1 1 5
1 1 1 4
2 1 1
2 1 1
1 1 1 5
`,
`1
0
0`);
check(`10
1 1 1 1 1 1 1 1 1 1
5
1 1 10 1
1 1 9 1
1 3 5 1
1 4 8 1
2 4 9
1 1 10 1
1 1 1 1
1 1 2 1
1 10 10 1
`,
`10
9
3
5
4
1
2
1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], A, [Q], ...queries] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const sqrtN = Math.ceil(Math.sqrt(N));
const rangeItems = [];
const rangeCounts = [];
for (let i = 0; i < sqrtN; i++) {
  const items = new Map();
  const counts = new Map();
  rangeItems.push(items);
  rangeCounts.push(counts);
  
  for (let j = 0; j < sqrtN; j++) {
    const idx = i * sqrtN + j;
    if (idx >= N) break;

    const Ai = A[idx];

    items.set(idx, Ai);

    if (!counts.has(Ai)) counts.set(Ai, 0);
    counts.set(Ai, counts.get(Ai) + 1);
  }
}

const out = [];
for (const [type, l, r, k] of queries) {
  const startRange = Math.floor((l - 1) / sqrtN);
  const startRangeEndIdx = (startRange + 1) * sqrtN - 1;
  const endRange = Math.floor((r - 1) / sqrtN);

  if (type === 1) {
    let count = 0;

    for (let i = l - 1; i <= startRangeEndIdx; i++) if (i < r && A[i] === k) count++;
    for (let i = startRange + 1; i < endRange; i++) count += rangeCounts[i].get(k) ?? 0;
    if (startRange !== endRange) for (let i = endRange * sqrtN; i < r; i++) if (A[i] === k) count++;

    out.push(count);
  } else if (type === 2) {
    for (let i = startRange; i <= endRange; i++) {
      const items = rangeItems[i];
      const counts = rangeCounts[i];

      for (const [idx, Ai] of items) {
        if (l - 1 <= idx && idx < r) {
          items.delete(idx);
          A[idx] = 0;
          counts.set(Ai, counts.get(Ai) - 1);
        }
      }
    }
  }
}

// output
return out.join("\n");
}
