const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky1004");

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
check(`5 10
0123456789
0123456789
0000000000
1111111111
2222222222
`,
`7`);
check(`2 2
0101010101
1010101010
`,
`1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N, K], ...s] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
[N, K] = [N, K].map(Number);
s = s.flat();

// code
const maxMask = (1 << 10) - 1;
const bitCounts = Array(maxMask + 1).fill(0);
for (let i = 0; i < 10; i++) {
  const bit = 1 << i;
  for (let j = 0; j <= maxMask; j++) {
    if ((bit & j) === 0) continue;
    bitCounts[j]++;
  }
}

const counts = Array(maxMask + 1).fill(0);
for (const si of s) {
  let mask = 0;
  for (let i = 0; i < 10; i++) {
    const bit = 1 << i;
    if (!si.includes(i)) continue;
    mask += bit;
  }
  counts[mask]++;
}

let out = 0;
for (let i = 0; i <= maxMask; i++) {
  const count = counts[i];
  if (bitCounts[i] === K) out += count * (count - 1) / 2;

  for (let j = i + 1; j <= maxMask; j++) {
    if (bitCounts[i | j] !== K) continue;
    out += count * counts[j];
  }
}

// output
return out;
}
