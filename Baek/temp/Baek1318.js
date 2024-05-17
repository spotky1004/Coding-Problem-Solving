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
check(``,
`answer`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// code
const cardValues = [];
for (let i = 0; i < 52; i++) {
  cardValues.push([Math.floor(i / 13), (i % 13) + 1]);
}

const totalComb = 52 * 51 * 50 * 49 * 48 * 47;
const counts = Array(12).fill(0);
for (let i = 0; i < 52; i++) {
  const [s1, v1] = cardValues[i];
  for (let ii = 0; ii < 52; ii++) {
    const [s2, v2] = cardValues[ii];
    for (let iii = 0; iii < 52; iii++) {
      const [s3, v3] = cardValues[iii];
      for (let iv = 0; iv < 52; iv++) {
        const [s4, v4] = cardValues[iv];
        for (let v = 0; v < 52; v++) {
          const [s5, v5] = cardValues[v];
          for (let vi = 0; vi < 52; vi++) {
            const [s6, v6] = cardValues[vi];
            if (new Set([i, ii, iii, iv, v, vi]).size !== 6) continue;
            const s = [s1, s2, s3, s4, s5, s6].sort((a, b) => a - b);
            const v = [v1, v2, v3, v4, v5, v6].sort((a, b) => a - b);
            if (v[0] === 1 && v[1] === 2 && v[2] === 3 && v[3] === 4 && v[4] === 5) counts[11]++;
            else if (s[0] === s[1] && s[1] === s[2] && s[2] === s[3] && s[3] === s[4] || s[1] === s[2] && s[2] === s[3] && s[3] === s[4] && s[4] === s[5]) counts[10]++;
            else if (v[0] === v[1] && v[1] === v[2] && v[2] === v[3] || v[1] === v[2] && v[2] === v[3] && v[3] === v[4] || v[2] === v[3] && v[3] === v[4] && v[4] === v[5]) counts[9]++;

          }
        }
      }
    }
  }
}

// output
return counts.map(v => `${v}/${totalComb}`).join("\n");
}
