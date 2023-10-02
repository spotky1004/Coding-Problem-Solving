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
check(`6
HJSHJS
JHSJHS
SHJSHJ`,
`HJS! HJS! HJS!`);
check(`10
HHJHSSHJJH
HHJHHJHJJS
HHJSHJHJSJ`,
`Hmm...`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [N, ...nums] = input
  .trim()
  .split("\n");
N = Number(N);

// code
const charIdx = {
  "H": 0,
  "J": 1,
  "S": 2
};
const charValue = [0, 0, 0];

for (let h = 4; h <= 4; h++) {
  charValue[0] = h;
  for (let j = 7; j <= 7; j++) {
    if (h === j) continue;
    charValue[1] = j;
    loop: for (let s = 9; s <= 9; s++) {
      if (h === s || j === s) continue;
      charValue[2] = s;

      const tmpNums = [...nums];
      for (let i = 0; i < N; i++) {
        if (tmpNums.length === 3) {
          const [a, b, c] = tmpNums.map(v => charValue[charIdx[v[i]]]);
          if (a < b && b < c) break;
          if (a === b && b === c) continue;
          if (!(a <= b && b <= c)) continue loop;
          if (a === b) tmpNums.pop();
          if (b === c) tmpNums.shift();
        } else {
          const [a, b] = tmpNums.map(v => charValue[charIdx[v[i]]]);
          if (a === b) continue;
          if (a < b) break;
          if (a > b) continue loop;
        }
      }
      return "HJS! HJS! HJS!";
    }
  }
}


// output
return "Hmm...";
}
