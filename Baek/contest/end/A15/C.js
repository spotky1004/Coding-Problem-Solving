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
check(`3 5200000 12
1 AAA 20000
1 BBB 25000
2 CCC 30000
1 AAA 100
1 BBB 23
6
1 CCC 7
3 AAA 4350
7
4 1 -5000
5 2 15
7
2 AAA 3
2 CCC 1
6`,
`2625000
5635000
5051500
2507550`);
check(`3 1000000 12
1 wolhyang 28310
1 ArenA 18420
2 UTIL 9560
1 wolhyang 1
1 ArenA 6
6
1 UTIL 9
4 1 -5000
7
3 wolhyang -1270
5 2 15
7
2 ArenA 2
2 UTIL 7
6`,
`861170
965000
976600
878900`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const lines = input
  .split("\n");
let line = 0;
const [N, M, Q] = lines[line++].split(" ").map(Number);

// code
/** @type {Map<string, number[]>} */
const groups = new Map();
/** @type {Map<string, number>} */
const cropNames = new Map();
const values = Array(N).fill(0);
for (let i = 0; i < N; i++) {
  const [num, name, value] = lines[line++].split(" ");

  if (!groups.has(num)) groups.set(num, []);
  if (!cropNames.has(name)) cropNames.set(name, i);

  groups.get(num).push(i);
  values[i] = Number(value) / 10;
}

let money = M / 10;
const items = Array(N).fill(0);
const out = [];
for (let i = 0; i < Q; i++) {
  let [type, p1, p2] = lines[line++].split(" ");
  type = Number(type);

  if (type === 1) {
    const idx = cropNames.get(p1);
    const count = Number(p2);
    if (count * values[idx] <= money) {
      money -= count * values[idx];
      items[idx] += count;
    }
  } else if (type === 2) {
    const idx = cropNames.get(p1);
    const count = Number(p2);
    const sellCount = Math.min(count, items[idx]);
    money += sellCount * values[idx];
    items[idx] -= sellCount;
  } else if (type === 3) {
    const idx = cropNames.get(p1);
    const delta = Number(p2) / 10;
    values[idx] += delta;
  } else if (type === 4) {
    const idxes = groups.get(p1);
    const delta = Number(p2) / 10;
    for (const idx of idxes) {
      values[idx] += delta;
    }
  } else if (type === 5) {
    const idxes = groups.get(p1);
    const delta = Number(p2);
    const mul = 100n + BigInt(delta);
    for (const idx of idxes) {
      values[idx] = Number(BigInt(values[idx]) * mul / 100n);
    }
  } else if (type === 6) {
    out.push(money);
  } else if (type === 7) {
    let totValue = money;
    for (let j = 0; j < N; j++) {
      totValue += items[j] * values[j];
    }
    out.push(totValue);
  }
}

// output
return out.map(v => v * 10).join("\n");
}
