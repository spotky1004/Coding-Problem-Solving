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
check(`5 5 1
1 3 5
3 4 1
3 5 1
1 2 4`,
`56 225
2 4 5`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], ...ppl] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}



const denPows = [1, 3 * M, (3 * M)**2, (3 * M)**3, (3 * M)**4, (3 * M)**5, (3 * M)**6];
const numCounts = Array(N + 1).fill(0);
for (const [a, b, c] of ppl) {
  numCounts[a]++;
  numCounts[b]++;
  numCounts[c]++;
}

let maxChance = -1;
let maxComb = null;
const den = denPows[K + 1];
for (let i = 1; i <= N; i++) {
  for (let j = i + 1; j <= N; j++) {
    for (let k = j + 1; k <= N; k++) {
      const dupChance = numCounts[i] + numCounts[j] + numCounts[k] + 3;
      const chance = (denPows[1] - dupChance)**K * dupChance;
      if (chance <= maxChance) continue;
      maxChance = chance;
      maxComb = [i, j, k];
    }
  }
}

const div = gcd(maxChance, den);

// output
return `${maxChance / div} ${den / div}\n${maxComb.join(" ")}`;
}
