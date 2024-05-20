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
check(`6 3`,
`YES
5 2 4
1 3 6`);
check(`9 3`,
`YES
9 2 8
4 1 7
6 3 5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const groupCount = N / K;

function isVaildGroup(group) {
  if (group.reduce((a, b) => a + b, 0) % K === 0) return false;
  return true;
}

if (
  K === 1 ||
  (K === N && K % 2 === 1)
) return "NO";
const powers = Array.from({ length: N }, (_, i) => i + 1);
if (K % 2 === 1) {
  for (let i = 0; i < groupCount - 1; i++) {
    let p = 0;
    while (true) {
      const ag = powers.slice(i * K, (i + 1) * K);
      const bg = powers.slice((i + 1) * K, (i + 2) * K);
      [ag[p], bg[0]] = [bg[0], ag[p]];
      if (isVaildGroup(ag) && isVaildGroup(bg)) break;
      p++;
    }
    if (p === K) throw "??";
    const a = (i * K + (p % K)) % N;
    const b = (i + 1) * K % N;
    [powers[a], powers[b]] = [powers[b], powers[a]];
  }
}

const out = ["YES"];
for (let i = 0; i < groupCount; i++) {
  out.push(powers.slice(i * K, (i + 1) * K).join(" "));
}

// output
return out.join("\n");
}
