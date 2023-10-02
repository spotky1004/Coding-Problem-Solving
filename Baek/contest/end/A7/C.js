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
check(`5 3.59
4 A+
3 B+
3 C+
1 D0
3`,
`A+`);
check(`3 4.44
5 A+
4 A+
1`,
`A0`);
check(`5 2.54
3 B+
2 B0
2 C+
2 C0
1`,
`F`);
check(`5 3.60
4 A+
3 B+
3 C+
1 D0
3`,
`impossible`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N, X], ...datas] = input
  .trim()
  .split("\n")
  .map(line => line.split(" "));

// code
const gradeScores = {
  "A+": 450, "A0": 400,
  "B+": 350, "B0": 300,
  "C+": 250, "C0": 200,
  "D+": 150, "D0": 100,
  "F": 0
};
const highGrades = {
  "A+": "impossible", "A0": "A+",
  "B+": "A0", "B0": "B+",
  "C+": "B0", "C0": "C+",
  "D+": "C0", "D0": "D+",
  "F": "D0"
};

N = Number(N);
X = Math.round(Number(X) * 100);
const L = Number(datas.pop()[0]);
const subs = datas.map(v => [Number(v[0]), gradeScores[v[1]]]);

const timeSum = subs.reduce((a, b) => a + b[0], 0) + L;
const gradeSum = subs.reduce((a, b) => a + b[0] * b[1], 0);

// const goal = timeSum * X;

for (const grade of Object.keys(gradeScores)) {
  const sum = (gradeSum + gradeScores[grade] * L) / timeSum;
  if (Math.floor(sum) <= X) return highGrades[grade];
}

// output
return "F";
}
