const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`3
1
+ 3 + 6
2
+ 3 + 6
+ 1 + 2
5
+ 3 * 1
+ 4 + 5
* 9 * 2
* 6 + 3
* 5 + 5`,
`LUCKY
UNLUCKY
LUCKY`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
let line = 0;
const out = [];
while (line < lines.length) {
  const [N] = lines[line++];
  const ops = lines.slice(line, line + Number(N));
  line += Number(N);

  let dp = Array(7).fill(false);
  dp[1] = true;
  for (const [op1, v1, op2, v2] of ops) {
    const newDp = Array(7).fill(false);
    for (let i = 0; i < 7; i++) {
      if (!dp[i]) continue;
      if (op1 === "+") {
        newDp[(i + Number(v1)) % 7] = true;
      } else {
        newDp[(i * Number(v1)) % 7] = true;
      }
      if (op2 === "+") {
        newDp[(i + Number(v2)) % 7] = true;
      } else {
        newDp[(i * Number(v2)) % 7] = true;
      }
    }
    dp = newDp;
  }
  if (dp[0]) out.push("LUCKY");
  else out.push("UNLUCKY");
}

// output
return out.join("\n");
}
