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
check(`3
1234 3412
1000 1
1 16`,
`LL
L
DDDD`);
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
const queries = [
  ["D", (x) => x * 2 % 10000],
  ["S", (x) => (x + 9999) % 10000],
  ["L", (x) => (x % 1000) * 10 + Math.floor(x / 1000)],
  ["R", (x) => 1000 * (x % 10) + Math.floor(x / 10)]
];

function search(a, b) {
  if (a === b) return "";

  const track1 = Array(10000).fill(null);
  track1[a] = [-1, ""];
  const queue = [a];
  loop: for (const value of queue) {
    for (const [name, func] of queries) {
      const newValue = func(value);
      if (newValue >= 10000) throw "??";

      if (track1[newValue] !== null) continue;
      track1[newValue] = [value, name];
      if (newValue === b) break loop;
      queue.push(newValue);
    }
  }

  let command = [];
  for (let i = b; ; i = track1[i][0]) {
    command.push(track1[i][1]);
    if (i === a) break;
  }
  return command.reverse().join("");
}

const out = [];
for (const [A, B] of cases) {
  out.push(search(A, B));
}

// output
return out.join("\n");
}
