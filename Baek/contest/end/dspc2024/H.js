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
check(`3
abc`,
`2
1 2
1 3`);
check(`7
iansong`,
`4
1 7
2 6
3 5
4 2`);
check(`6
abcabc`,
`3
1 2
3 4
5 6`);
check(`3
aab`,
`-1`);
check(`1
a`,
`-1`);
check(`9
abcacbaac`,
`5
1 3
2 4
2 9
5 7
6 8`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [, S] = input
  .trim()
  .split("\n");
const N = S.length;

// code
const idxes = Array.from({ length: 26 }, () => []);
for (let i = N - 1; i >= 0; i--) {
  idxes[parseInt(S[i], 36) - 10].push(i);
}
if (idxes.some(v => v.length > N / 2)) return "-1";

const modifiedS = Array.from(S);
const swaps = [];
const swapped = Array(N).fill(false);
for (let i = 0; i < N; i++) {
  if (swapped[i]) continue;
  const type = parseInt(S[i], 36) - 10;
  const maxLeft = idxes.map((v, i) => [v.length, i]).filter(v => v[1] !== type).sort((a, b) => b[0] - a[0])[0][1];
  const swapWith = idxes[maxLeft].pop();
  if (typeof swapWith === "undefined") continue;
  swaps.push([i + 1, swapWith + 1]);
  swapped[i] = true;
  swapped[swapWith] = true;
  [modifiedS[i], modifiedS[swapWith]] = [modifiedS[swapWith], modifiedS[i]];
  for (let j = 0; j < 26; j++) {
    while (swapped[idxes[j][idxes[j].length - 1]]) idxes[j].pop();
  }
}
for (let i = 0; i < N; i++) {
  if (modifiedS[i] !== S[i]) continue;
  for (let j = 0; j < N; j++) {
    if (
      modifiedS[i] === modifiedS[j] ||
      S[i] === modifiedS[j] ||
      S[j] === modifiedS[i]
    ) continue;
    swaps.push([i + 1, j + 1]);
    [modifiedS[i], modifiedS[j]] = [modifiedS[j], modifiedS[i]];
    break;
  }
}
// console.log(modifiedS.join(""), modifiedS.some((v, i) => v === S[i]));

// output
return Math.ceil(N / 2) + "\n" + swaps.map(v => v.sort((a, b) => a - b)).sort((a, b) => a[0] - b[0]).map(v => v.join(" ")).join("\n");
}
