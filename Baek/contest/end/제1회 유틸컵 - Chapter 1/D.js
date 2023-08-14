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
check(`2
1 5
5 7
1
2`,
`5 1
7 5`);
check(`1
1000
2
2
2`,
`1000`);
check(`3
1 2 3
4 5 6
7 8 9
3
1 1
1 2
2`,
`7 6 3
8 4 1
9 5 2`);
check(`3
121 434 211
344 677 666
111 222 333
3
1 1
1 2
1 2`,
`211 121 434
677 666 344
111 222 333`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...datas] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let mat = datas.splice(0, N);
const [Q] = datas.shift();
const queries = datas;

for (const [type, i] of queries) {
  if (type === 1) {
    mat[i - 1].unshift(mat[i - 1].pop());
  } else {
    const newMat = [];
    for (let t = 0; t < N; t++) {
      const row = [];
      newMat.push(row);
      for (let u = 0; u < N; u++) {
        row.push(mat[N - u - 1][t]);
      }
    }
    mat = newMat;
  }
}

// output
return mat.map(row => row.join(" ")).join("\n");
}
