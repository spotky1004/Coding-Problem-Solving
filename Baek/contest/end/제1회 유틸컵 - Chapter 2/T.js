const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
check(`100 3
Challenger 10
Master 50%
Diamond 45
Master4`,
`47 55`);
check(`100 3
Challenger 10
Master 45
Diamond 99%
Diamond`,
`Invalid System`);
check(`1000 4
InternationalGrandmaster 3
Grandmaster 7
Master 10%
Expert 100%
InternationalGrandmaster4`,
`Liar`);
check(`1000 1
SS 100%
SS`,
`1 1000`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const _input = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

const [N, T] = _input.shift().map(Number);
const [friendTier] = _input.pop();
const tiers = _input;

// code
const friendTierName = friendTier.match(/[^\d]+/)[0];
const friendTierNum = Number(friendTier.slice(-1)) || null;
const friendTierRange = [-1, -1];

let M = N;
for (let i = 0; i < T; i++) {
  const [tierName, tierPool] = tiers[i];
  let tierPlayers;
  if (tierPool.endsWith("%")) {
    tierPlayers = Math.floor(M * parseInt(tierPool) / 100);
  } else {
    tierPlayers = Math.min(M, Number(tierPool));
  }

  let tierPlayerLeft = tierPlayers;
  const tierRanges = [0, 0, 0, 0];
  for (let j = 0; j < 4; j++) {
    const rangePool = Math.min(tierPlayerLeft, Math.ceil(tierPlayers / 4));
    tierRanges[j] = rangePool;
    tierPlayerLeft -= rangePool;
  }

  if (friendTierName === tierName) {
    const tierStart = N - M + 1;
    const tierRangeStart = friendTierNum ? tierRanges.slice(0, friendTierNum - 1).reduce((a, b) => a + b, 0) : 0;
    const tierRangeEnd = friendTierNum ? tierRanges[friendTierNum - 1] : tierRanges.reduce((a, b) => a + b, 0);
    friendTierRange[0] = tierStart + tierRangeStart;
    friendTierRange[1] = tierStart + tierRangeStart + tierRangeEnd - 1;
  }

  M -= tierPlayers;
}

// output
if (M > 0) return "Invalid System";
if (
  friendTierRange[0] > friendTierRange[1] ||
  friendTierRange[0] === -1
) return "Liar";
return friendTierRange.join(" ");
}
