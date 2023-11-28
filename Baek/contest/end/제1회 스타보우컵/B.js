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
check(`6 5 26 62
72 81 47 29 97
2 75 25 82 84
17 6 7 2 3
2
2
2
1
0
4`,
`723`);
check(`7 7 98 25
12 64 97 23 20 97 80
17 38 76 83 65 40 41
15 3 16 6 23 11 34
2
7
0
7
7
6
6`,
`-1`);
check(`1 1 100 100
1
1
100
1`,
`-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, K, C, R], base, s, p, ...l] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let stardust = 0;
let stress = 0;
let combo = 0;
const skills = Array(K).fill(0);
for (const li of l.flat()) {
  if (li === 0) {
    stress = Math.max(0, stress - R);
    combo = 0;
    continue;
  }

  const toUse = li - 1;

  const bi = base[toUse];
  const si = s[toUse];
  const pi = p[toUse];
  const skill = skills[toUse];
  
  stress += pi;
  if (stress > 100) return -1;

  stardust += Math.floor(bi * (1 + C * combo / 100) * (1 + skill * si / 100));

  skills[toUse]++;
  combo++;
}

// output
return stardust;
}
