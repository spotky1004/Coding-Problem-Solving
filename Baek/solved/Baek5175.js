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
check(`2
2 3
1
2
1 2
4 5
1 2 3
1 2
2 4
1 3 4
2 3 4`,
`Data Set 1: C

Data Set 2: A C`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[K], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} n 
 * @param {(comb: number[]) => void} callback 
 */
function combBruteSearcher(n, callback) {
  const comb = [];
  function impl(i = 0) {
    callback(comb);
    if (i >= n) return;
    impl(i + 1);
    comb.push(i);
    impl(i + 1);
    comb.pop();
  }
  impl();
}



const out = [];
let line = 0;
for (let k = 1; k <= K; k++) {
  const [M, N] = lines[line++];
  const questions = lines.slice(line, line + N);
  const questionBits = questions.map(q => q.reduce((a, b) => a + 2 ** (b -1 ), 0));
  line += N;
  const goal = (1 << M) - 1;
  let ansQSet = "";
  let minCount = Infinity;
  combBruteSearcher(N, (selected) => {
    if (selected.length > minCount) return;

    let value = 0;
    let qSet = "";
    for (const qIdx of selected) {
      value |= questionBits[qIdx];
      qSet += (qIdx + 10).toString(36).toUpperCase() + " ";
    }

    qSet = qSet.trim();
    if (value !== goal) return;
    if (selected.length < minCount || qSet <= ansQSet) ansQSet = qSet;
    minCount = selected.length;
  });

  out.push(`Data Set ${k}: ${ansQSet}\n`);
}

// output
return out.join("\n").trim();
}
