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
check(`5
1 1
ㅇ
7 1
ㄹ
4 2
ㅣ ㅏ
1000 3
ㅅ ㅣ ㄱ
10 6
ㅜ ㅣ ㅇ ㅠ ㅗ ㅏ`,
`3
20
500
500005000000050000005
-1`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .trim()
  .split("\n")

// code
const g1s = [
  [0n, ""],
  [1n, "ㅇㅣㄹ"],
  [2n, "ㅇㅣ"],
  [3n, "ㅅㅏㅁ"],
  [4n, "ㅅㅏ"],
  [5n, "ㅇㅗ"],
  [6n, "ㅇㅠㄱ"],
  [7n, "ㅊㅣㄹ"],
  [8n, "ㅍㅏㄹ"],
  [9n, "ㄱㅜ"]
];
const g2s = [
  [   1n, ""],
  [  10n, "ㅅㅣㅂ"],
  [ 100n, "ㅂㅐㄱ"],
  [1000n, "ㅊㅓㄴ"]
];
const g3s = [
  [10n** 0n, ""],
  [10n** 4n, "ㅁㅏㄴ"],
  [10n** 8n, "ㅇㅓㄱ"],
  [10n**12n, "ㅈㅗ"],
  [10n**16n, "ㄱㅕㅇ"],
  [10n**20n, "ㅎㅐ"],
  [10n**24n, "ㅈㅏ"],
  [10n**28n, "ㅇㅑㅇ"],
  [10n**32n, "ㄱㅜ"],
  [10n**36n, "ㄱㅏㄴ"],
  [10n**40n, "ㅈㅓㅇ"],
  [10n**44n, "ㅈㅐ"],
  [10n**48n, "ㄱㅡㄱ"],
]

const T = Number(lines.shift());
const out = [];
for (let i = 0; i < T; i++) {
  const [N, M] = lines.shift().split(" ").map(BigInt);
  const forgotten = lines.shift().split(" ");
  const g1Filter = g1s.filter(v => !forgotten.some(f => v[1].includes(f))).map(v => v[0]);
  const g2Filter = g2s.filter(v => !forgotten.some(f => v[1].includes(f))).map(v => v[0]);
  const g3Filter = g3s.filter(v => !forgotten.some(f => v[1].includes(f))).map(v => v[0]);
  
  const base = BigInt(g1Filter.length);
  if (base === 1n) {
    out.push(-1);
    continue;
  }

  let left = N;
  let sum = 0n;
  loop: for (const g3 of g3Filter) {
    for (const g2 of g2Filter) {
      if (left === 0n) break loop;
      sum += g1Filter[left % base] * g2 * g3;
      left /= base;
    }
  }
  
  if (left > 0n) {
    out.push(-1);
    continue;
  }
  out.push(sum);
}

// output
return out.join("\n");
}
