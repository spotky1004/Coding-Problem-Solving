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
check(`7
roygbiv`,
`yes`);
check(`7
ROYGBIV`,
`YES`);
check(`14
rRoOyYgGbBiIvV`,
`YeS`);
check(`7
rainbow`,
`NO!`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [N, str] = input
  .trim()
  .split("\n")

// code
const rainbowLookup = {
  "r": 0, "o": 1, "y": 2,
  "g": 3, "b": 4, "i": 5,
  "v": 6
};
const lowRainbow = Array(7).fill(false);
const uppRainbow = Array(7).fill(false);
for (const c of str) {
  const isUp = c.toUpperCase() === c;
  const idx = rainbowLookup[c.toLowerCase()];
  if (typeof idx === "undefined") continue;

  if (isUp) uppRainbow[idx] = true;
  else lowRainbow[idx] = true;
}

const low = lowRainbow.every(v => v);
const upp = uppRainbow.every(v => v);
if (upp && low) return "YeS";
if (upp) return "YES";
if (low) return "yes";

// output
return "NO!";
}
