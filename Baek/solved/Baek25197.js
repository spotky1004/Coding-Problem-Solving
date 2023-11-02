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
check(`3 2`,
[`1.5`, `1.500000`]);
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
const comb_iC2 = [0, 0, 1];
for (let i = comb_iC2.length; i <= N; i++) {
  comb_iC2.push(comb_iC2[i - 1] * i / (i - 2));
}
const comb_NCi = [0, N];
for (let i = comb_NCi.length; i <= N; i++) {
  comb_NCi.push(comb_NCi[i - 1] * (N - i + 1) / i);
}
const chances = [];
for (let i = 0; i <= N; i++) {
  let chance = 1;
  for (let j = 0; j < i; j++) {
    chance *= 1 / K;
  }
  for (let j = 0; j < N - i; j++) {
    chance *= 1 - 1 / K;
  }
  chances.push(chance);
}

let oneExp = 0;
for (let i = 0; i <= N; i++) {
  oneExp += comb_iC2[i] * comb_NCi[i] * chances[i];
}
const exp = oneExp * K;

// output
return exp;
}
