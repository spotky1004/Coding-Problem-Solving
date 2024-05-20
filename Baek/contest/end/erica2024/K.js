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
check(`10 4
1122
2211`,
`ras`);
check(`3 4
1122
2211`,
`auq`);
check(`5 4
1234
3002`,
`rasauq`);
check(`5 4
1234
3003`,
`auq`);
check(`10 9
${"9".repeat(3000000)}
${"9".repeat(3000000)}`,
`ras`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[rawU, rawV], [A], [B]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
const u = Number(rawU);
const v = Number(rawV);

// code
if (A.length > 1200) {
  if (u > v) return "ras";
  if (v < u) return "auq";
  if (A > B) return "ras";
  if (A < B) return "auq";
  if (A === B) return "rasauq";
}

function parseBig(value, base) {
  base = BigInt(base);
  let out = 0n;
  let digitVal = 1n;
  for (let i = value.length - 1; i >= 0; i--) {
    out += BigInt(value[i]) * digitVal;
    digitVal *= base;
  }
  return out;
}

const aInt = parseBig(A, u);
const bInt = parseBig(B, v);

if (aInt === bInt) return "rasauq";
if (aInt > bInt) return "ras";
if (aInt < bInt) return "auq";
}
