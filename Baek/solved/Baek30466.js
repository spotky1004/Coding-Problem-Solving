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
check(`7
`,
[`12
1 2
1 3
1 4
2 5
2 6
5 7`,
`12
1 2
1 3
1 4
2 5
5 6
6 7`]);
check(`3
`,
`0
1 2
2 3`);
check(`4`,
`2
1 2
1 3
2 4`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const halfPoint = Math.ceil((N - 1) / 2) + 2;

const dfsOrder = [null, 1, 2];
for (let i = halfPoint; i <= N; i++) dfsOrder.push(i);
for (let i = 3; i < halfPoint; i++) dfsOrder.push(i);

let maxScore = 0;
for (let i = 1; i <= N; i++) {
  maxScore += Math.abs(i - dfsOrder[i]);
}

const edges = [];
for (let i = 2; i < halfPoint; i++) edges.push(`1 ${i}`);
let prev = 2;
for (let i = halfPoint; i <= N; i++) {
  edges.push(`${prev} ${i}`);
  prev = i;
}

// output
return `${maxScore}\n` + edges.join("\n");
}
