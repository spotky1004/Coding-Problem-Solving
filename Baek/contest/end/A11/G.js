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
check(`5
1 2 3 4 5
1 2
2 3
3 4
4 5`,
`Sejong`);
check(`4
1 2 1 3
1 2
3 4
4 2`,
`Areum`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], f, ...moves] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
// 으악 지문 잘못 읽었다
const calcG = (x) => ((x + 1) % 2) + 1;

let sumG = f.reduce((a, b) => a ^ calcG(b), 0);
let G = sumG;
for (const [u, v] of moves) {
  sumG ^= calcG(f[u - 1]) ^ calcG(f[v - 1]);
  f[v - 1] += f[u - 1];
  f[u - 1] = 0;
  sumG ^= calcG(f[v - 1]);

  G ^= sumG;
}

// output
return G !== 0 ? "Sejong" : "Areum";
}
