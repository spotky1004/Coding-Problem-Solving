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
check(`2
superaquatornado
2
abcdefghijklmnopqrstuvwxyz
5`,
`4 8
-1`);
check(`1
abaaaba
3`,
`3 4`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [T, ...lines] = input
  .trim()
  .split("\n");

// code
const out = [];
for (let caseNr = 0; caseNr < T; caseNr++) {
  const alphaIdxes = Array.from({ length: 26 }, () => []);
  const W = lines[caseNr * 2];
  const K = Number(lines[caseNr * 2 + 1]);
  for (let i = 0; i < W.length; i++) {
    alphaIdxes[parseInt(W[i], 36) - 10].push(i);
  }

  let q3 = Infinity;
  let q4 = -Infinity;
  for (let i = 0; i < 26; i++) {
    const idxes = alphaIdxes[i];
    for (let r = K - 1; r < idxes.length; r++) {
      const l = r - K + 1;
      const len = idxes[r] - idxes[l] + 1;
      q3 = Math.min(q3, len);
      q4 = Math.max(q4, len);
    }
  }

  if (isFinite(q3)) {
    out.push(`${q3} ${q4}`);
  } else {
    out.push(`-1`);
  }
}

// output
return out.join("\n");
}
