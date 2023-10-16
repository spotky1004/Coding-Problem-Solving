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
check(`4
6 2 0.25 0.5
10 2 0.25 0.5
29.29 4 0.3 0.7 0.43 0.54
29.30 4 0.3 0.7 0.43 0.54`,
`Mikael
Nils
Nils
Mikael`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const mul = 30000;

const out = [];
for (const [X, K, ...cards] of lines) {
  cards.sort((a, b) => b - a);
  
  const logX = Math.log(X);
  const logCards = cards.map(card => -Math.log(card));

  const xMul = Math.round(logX * mul);
  const cardsMul = logCards.map(card => Math.round(card * mul));

  const g = Array(xMul + 1).fill(0);
  for (let i = 1; i <= xMul; i++) {
    const gSet = new Set();
    for (const card of cardsMul) {
      gSet.add(g[i - card] ?? 0);
    }

    let grundy = 0;
    while (gSet.has(grundy)) grundy++;
    g[i] = grundy;
  }

  out.push(g[xMul] === 0 ? "Mikael" : "Nils");
}

// output
return out.join("\n");
}
