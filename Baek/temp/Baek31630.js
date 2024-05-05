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
check(`4 4 3
1 1
1 3
3 1`,
`4`);
/**
 * 11111
 * 0x0x0
 * 01122
 * 0x000
 * 01111
 */
check(`4 4 4
1 1
1 3
3 1
3 3`,
`6`);
/**
 * 11111
 * 0x0x0
 * 01122
 * 0x0x0
 * 01133
 */
check(`10 10 5
1 1
3 3
5 5
7 7
9 9`,
`32`);
/**
 * 11111111111
 * 0x000000000
 * 01111111111
 * 000x0000000
 * 00022222222
 * 00000x00000
 * 00000444444
 * 0000000x000
 * 00000008888
 * 000000000x0
 * 00000000066
 */
check(`10 10 5
1 9
3 7
5 5
7 3
9 1`,
`6`);
check(`6 4 3
1 1
2 1
1 3
2 3
4 1
5 1`,
`4`);
/**
 * 11111
 * 0x0x0
 * 0x0x0
 * 01122
 * 0x000
 * 0x000
 * 01111
 */
check(`5 4 8
1 1
1 2
2 2
3 2
4 1
4 2
4 3
3 4`,
`1`);
/**
 * 11111
 * 0xx00
 * 01x00
 * 00x0x
 * 0xxx0
 * 01111
 */
check(`6 6 8
1 2
1 4
2 1
2 5
4 1
4 5
5 2
5 4`,
`6`);
/**
 * 1111111
 * 00x0x00
 * 0x001x0
 * 0111122
 * 0x000x0
 * 01x0x00
 * 0011333
 */
check(`6 6 13
1 2
1 4
2 1
2 5
4 1
4 5
5 2
5 4
1 1
1 5
5 1
5 5
3 3`,
`4`);
/**
 * 1111111
 * 0xx0xx0
 * 0x001x0
 * 011x011
 * 0x011x0
 * 0xx0xx0
 * 0111222
 */
check(`4 4 6
1 3
2 1
3 1
3 2`,
`3`);
/**
 * 11111
 * 001x0
 * 0x011
 * 0xx00
 * 01111
 */
check(`2 2 3
0 1
1 0
1 1`,
`0`);
/**
 * 1x0
 * xx0
 * 000
 */
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[R, C, K], ...gajis] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const mod = 1_000_000_007;
const dp = Array(R + 1).fill(0);
dp[0] = 1;
const field = Array.from({ length: R + 1 }, () => Array(C + 1).fill(false));
const tmp = Array.from({ length: R + 1 }, () => Array(C + 1).fill(0));
tmp[0][0] = 1;
for (const [r, c] of gajis) {
  field[r][c] = true;
  tmp[r][c] = "🍆";
}


for (let c = 1; c <= C; c++) {
  let acc = 0;
  for (let r = 0; r <= R; r++) {
    acc += dp[r];
    if (
      field[r][c - 1] ||
      (r !== R && field[r + 1][c - 1]) ||
      (r !== 0 && field[r - 1][c - 1])
    ) {
      acc = 0;
    }
    if (field[r][c]) {
      if (r !== R) {
        dp[r + 1] = (dp[r + 1] + acc) % mod;
        acc = 0;
      }
      dp[r] = 0;
    }
    if (dp[r] !== 0) tmp[r][c] = dp[r];
  }
}
console.table(tmp);

let out = 0;
for (let r = R; r >= 0; r--) {
  if (field[r][C]) break;
  out += dp[r];
}

// output
return out % mod;
}
