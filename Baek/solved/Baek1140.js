const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString();
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
check(`92 10 90 20 170`,
`790`);
check(`90 10 90 20 170`,
`770`);
check(`99 10 90 20 170`,
`850`);
check(`10 1 11 20 300`,
`100`);
check(`0 10 80 50 400`,
`0`);
check(`28 1 10 1 8`,
`224`);
check(`450702146848 63791 433956 115281 666125`,
`2604279739220`);
check(`45 6 12 7 14`,
`90`);
check(`7 5 5 8 9`,
`9`);
check(`8 5 71 3 144`,
`80`);
check(`13 8 52 2 7`,
`49`);
check(`1000000000000 1 1 5 10`,
`1000000000000`);
check(`1234567891000 10 90 20 170`,
`10493827073500`);
check(`1234567891000 10 100 10 90`,
`11111111019000`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[T, K1, P1, K2, P2]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
function getCost1_1(x) {
  const rest = Math.max(0, T - x * K1);
  const Y2 = Math.ceil(rest / K2);
  return x * P1 + Y2 * P2;
}
function getCost1_2(x) {
  const rest = Math.max(0, T - x * K1);
  const Z2 = Math.floor(rest / K2);
  return x * P1 + Z2 * P2 + 10 * (rest - Z2 * K2);
}

function getCost2_1(x) {
  const rest = Math.max(0, T - x * K2);
  const Y1 = Math.ceil(rest / K1);
  return x * P2 + Y1 * P1;
}
function getCost2_2(x) {
  const rest = Math.max(0, T - x * K2);
  const Z1 = Math.floor(rest / K1);
  return x * P2 + Z1 * P1 + 10 * (rest - Z1 * K1);
}

const X1 = Math.ceil(T / K1);
const X2 = Math.ceil(T / K2);
let min = Math.min(
  T * 10,
  getCost1_1(0), getCost1_1(X1 - 1), getCost1_1(X1),
  getCost1_2(0), getCost1_2(X1 - 1), getCost1_2(X1),
  getCost2_1(0), getCost2_1(X2 - 1), getCost2_1(X2),
  getCost2_2(0), getCost2_2(X2 - 1), getCost2_2(X2)
);

const eff1 = P1 / K1;
const eff2 = P2 / K2;
if (eff1 < 10 && eff2 < 10) {
  let prev = Infinity;
  let i = 1;
  while (true) {
    if (X1 < i || X2 < i) break;
    const V1 = getCost1_1(i);
    const V2 = getCost1_2(i);
    const cur = Math.min(V1, V2);
    if (cur >= prev) break;
    min = Math.min(min, cur);
    prev = cur;
    if (V1 === V2) break;
    i++;
  }

  prev = Infinity;
  i = 1;
  while (true) {
    if (X1 < i || X2 < i) break;
    const V1 = getCost2_1(i);
    const V2 = getCost2_2(i);
    const cur = Math.min(V1, V2);
    if (cur >= prev) break;
    min = Math.min(min, cur);
    prev = cur;
    if (V1 === V2) break;
    i++;
  }
}

// output
return min;
}
