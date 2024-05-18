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
check(`📅
📆`,
`3️⃣4️⃣`);
check(`💯1️⃣
🥇`,
`💯2️⃣`);
check(`🎰🎰🎰🎰🎰
📅📅📅📅`,
`🎰🎰7️⃣9️⃣4️⃣9️⃣4️⃣9️⃣4️⃣9️⃣4️⃣`);
check(`📟
0️⃣`,
`📟`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [A, B] = input
  .trim()
  .split("\n");

// code
const vars = {
  "🧑‍🏫": "22",
  "🧑🏻‍🏫": "22",
  "🧑🏼‍🏫": "22",
  "🧑🏽‍🏫": "22",
  "🧑🏾‍🏫": "22",
  "🧑🏿‍🏫": "22",
  "👨‍🏫": "22",
  "👨🏻‍🏫": "22",
  "👨🏼‍🏫": "22",
  "👨🏽‍🏫": "22",
  "👨🏾‍🏫": "22",
  "👨🏿‍🏫": "22",
  "👩‍🏫": "22",
  "👩🏻‍🏫": "22",
  "👩🏼‍🏫": "22",
  "👩🏽‍🏫": "22",
  "👩🏾‍🏫": "22",
  "👩🏿‍🏫": "22",
  "🥇": "1",
  "🥈": "2",
  "🥉": "3",
  "🎱": "8",
  "🎰": "777",
  "🎲": "1",
  "🏎️": "3",
  "🏪": "24",
  "📅": "17",
  "📆": "17",
  "💯": "100",
  "🔞": "18",
  "🔂": "1",
  "0️⃣": "0",
  "1️⃣": "1",
  "2️⃣": "2",
  "3️⃣": "3",
  "4️⃣": "4",
  "5️⃣": "5",
  "6️⃣": "6",
  "7️⃣": "7",
  "8️⃣": "8",
  "9️⃣": "9",
  "🔟": "10",
  "🔢": "1234",
  "": "109",
  "📟": "40404",
};
const chars = Object.keys(vars);
const varsInvMap = new Map(Object.entries(vars).map(v => [v[1], v[0]]));

const a = A.match(new RegExp(chars.join("|"), "g")).map(v => vars[v]).join("");
const b = B.match(new RegExp(chars.join("|"), "g")).map(v => vars[v]).join("");
if (A.length - (A.match(new RegExp(chars.join("|"), "g") ?? [""])).join("").length > 0) throw "??";
if (B.length - (B.match(new RegExp(chars.join("|"), "g") ?? [""])).join("").length > 0) throw "??";
const sum = (BigInt(a) + BigInt(b)).toString();
const dp = [[varsInvMap.get(sum[0])]];
for (let i = 1; i < sum.length; i++) {
  let min = [...dp[i - 1]];
  min.push(varsInvMap.get(sum[i]));

  for (let j = 0; j <= i; j++) {
    const slice = sum.slice(j, i + 1);
    if (!varsInvMap.has(slice)) continue;
    const cur = j - 1 >= 0 ? [...dp[j - 1]] : [];
    cur.push(varsInvMap.get(slice));
    if (min.length > cur.length) min = cur;
  }

  dp.push(min);
}

if (dp[sum.length - 1].map(v => vars[v]).join("").length !== sum.length) throw "??";
// output
return dp[sum.length - 1].join("");
}
