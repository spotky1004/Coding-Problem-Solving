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
check(`1
1 4 5`,
`70000 30000`);
check(`2
3 3 3
103 64 171`,
`60000 30000
1450000 1930000`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...cases] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
function fillDp(maxStone) {
  const dp = Array.from({ length: maxStone + 1 }, _ => Array.from({ length: maxStone + 1 }, _ => Array.from({ length: maxStone + 1 }, _ => null)));
  dp[0][0][0] = [false, 0];
  for (let x = 0; x <= maxStone; x++) {
    for (let y = 0; y <= x; y++) {
      for (let z = 0; z <= y; z++) {
        let canWin = false;
        let maxMoney = 0;
        let moneySum = x + y + z;
        for (let nx = 0; nx < x; nx++) {
          const [lose, opMoney] = dp[nx][y][z];
          if (lose && canWin) continue;
          const money = moneySum - opMoney;
          if (!canWin && !lose) {
            canWin = true;
            maxMoney = money;
            break;
          } else {
            maxMoney = Math.max(maxMoney, money);
          }
        }
        for (let ny = 0; ny < y; ny++) {
          const [lose, opMoney] = dp[x][ny][z];
          if (lose && canWin) continue;
          const money = moneySum - opMoney;
          if (!canWin && !lose) {
            canWin = true;
            maxMoney = money;
            break;
          } else {
            maxMoney = Math.max(maxMoney, money);
          }
        }
        for (let nz = 0; nz < z; nz++) {
          const [lose, opMoney] = dp[x][y][nz];
          if (lose && canWin) continue;
          const money = moneySum - opMoney;
          if (!canWin && !lose) {
            canWin = true;
            maxMoney = money;
            break;
          } else {
            maxMoney = Math.max(maxMoney, money);
          }
        }

        dp[x][y][z] = [canWin, maxMoney];
        dp[x][z][y] = [canWin, maxMoney];
        dp[y][x][z] = [canWin, maxMoney];
        dp[y][z][x] = [canWin, maxMoney];
        dp[z][x][y] = [canWin, maxMoney];
        dp[z][y][z] = [canWin, maxMoney];
      }
    }
  }
  return dp;
}

const dp = fillDp(200);
const out = [];
for (const xyz of cases) {
  xyz.sort((a, b) => a - b);
  const sum = xyz.reduce((a, b) => a + b, 0);
  const [, value] = dp[xyz[0]][xyz[1]][xyz[2]];
  out.push(`${value * 10000} ${(sum - value) * 10000}`);
}

// output
return out.join("\n");
}
