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
check(`4 5
1122`,
`4`);
check(`4 5
2211`,
`5`);
check(`10 10
1222222122`,
`10`);
check(`4 50000
1111`,
`46875`);
check(`4 1024
1111`,
`960`);
check(`4 2047
1111`,
`1920`);
check(`15 2047
222222222222222`,
`2046`);
check(`15 2047
122222222222222`,
`2046`);
check(`13 2047
1111111111122`,
`2047`);
check(`4 20
1112`,
`19`);
check(`4 20
1222`,
`18`);
check(`4 20
1111`,
`19`);
check(`3 20
111`,
`18`);
check(`2 20
12`,
`15`);
check(`8 23947293
12212211`,
`23853749`);
check(`21 2047
222222222222222222221`,
`2047`);
check(`10010 1024
1111111111${"2".repeat(10000)}`,
`1023`);
check(`10010 1023
1111111111${"2".repeat(10000)}`,
`1023`);
check(`10009 1023
111111111${"2".repeat(10000)}`,
`1022`);
check(`12 99999999
111111111111`,
`99975585`);
check(`4 99999999
1111`,
`93750000`);
check(`1 99999999
1`,
`50000000`);
check(`1 99999999
2`,
`49999999`);
check(`4 99999999
1212`,
`93749999`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[rawN, rawT], [P]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));
const N = Number(rawN);
const T = Number(rawT);

// code
const rem = parseInt([...P].reverse().map(v => 2 - Number(v)).join(""), 2);
let ans = T;
let tLeft = T;
if (tLeft > rem) {
  ans--;
  tLeft -= rem + 1;
}
ans -= Math.floor(tLeft / 2 ** N);

// output
return ans;
}
