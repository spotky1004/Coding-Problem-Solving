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
check(`6
001100110011
110..0...00...0011
..............
01....100100
010101110100
101011011001`,
`yes
yes
yes
no
no
no`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...cases] = input
  .trim()
  .split("\n");

// code
/**
 * @param {number[]} S 
 */
function checkRL(S) {
  for (let i = 2; i < S.length; i++) {
    if (
      S[i] !== -1 &&
      S[i] === S[i - 1] &&
      S[i] === S[i - 2]
    ) return false;
  }
  return true;
}

/**
 * @param {number[]} S 
 * @param {0 | 1} value 
 */
function maxFill(S, value) {
  S = [...S];
  for (let i = 0; i < S.length; i++) {
    if (S[i] !== -1) continue;
    let combo = 1;
    if (S[i + 1] === value) {
      combo++;
      if (S[i + 2] === value) combo++;
    }
    if (S[i - 1] === value) {
      combo++;
      if (S[i - 2] === value) combo++;
    }
    if (combo >= 3) S[i] = value ^ 1;
    else S[i] = value;
  }
  return S;
}

const out = [];
for (const str of cases) {
  const S = Array.from(str).map(v => v === "." ? -1 : Number(v));
  const N = S.length;
  for (let i = 2; i < N; i++) {
    if (
      S[i - 2] !== -1 &&
      S[i] === -1 &&
      S[i - 2] === S[i - 1]
    ) S[i] = S[i - 1] ^ 1;
    if (
      S[i] !== -1 &&
      S[i - 2] === -1 &&
      S[i] === S[i - 1]
    ) S[i - 2] = S[i] ^ 1;
  }
  if (!checkRL(S)) {
    out.push("no");
    continue;
  }

  const minZero = maxFill(S, 1).reduce((a, b) => a + (b === 0), 0);
  const maxZero = maxFill(S, 0).reduce((a, b) => a + (b === 0), 0);

  if (minZero <= N / 2 && N / 2 <= maxZero) out.push("yes");
  else out.push("no");
}

// output
return out.join("\n");
}
