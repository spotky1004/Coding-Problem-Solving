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
check(`2 3 1
1 2`,
`4`);
check(`5 4 2
2 2
4 3`,
`32`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, M, K], ...bombs] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
/**
 * @param {number} to
 * @param {number} mod
*/
function genFactroialMod(to) {
  const factorials = [1n];
  let cur = 1n;
  for (let i = 1n; i <= to; i++) {
    cur = (cur * i) % p;
    factorials.push(cur);
  }

  return factorials;
}

/**
 * @param {BigInt} a 
 * @param {BigInt} b 
 * @param {BigInt} p
*/
function divAndPow(a, b, p) {
  let out = 1n;
  let curMul = a;
  const loopCount = BigInt(Math.ceil(Math.log2(Number(b))) + 1);
  for (let i = 0n; i < loopCount; i++) {
    if (b & 1n << i) {
      out = out*curMul % p;
    }
    curMul = curMul**2n % p;
  }
  return out;
}

/**
 * @param {bigint} n 
 * @param {bigint} r 
 * @param {bigint} p
 * @param {bigint[]} factroials
*/
function combination(n, r) {
  return factroials[n] * divAndPow(factroials[n - r] * factroials[r], p - 2n, p) % p;
}



const p = 1_000_000_007n;

const factroials = genFactroialMod(Number(N + M));
const bombValues = Array(K).fill(null);
function searchBombValue(idx) {
  if (bombValues[idx] !== null) return bombValues[idx];
  const [x, y] = bombs[idx];
  let value = combination(x + y, x);
  for (let i = 0; i < K; i++) {
    const [bx, by] = bombs[i];
    if (i === idx || bx > x || by > y) continue;
    const [dx, dy] = [x - bx, y - by];
    value = (value - ((combination(dx + dy, dx) * searchBombValue(i)) % p) + p) % p;
  }
  bombValues[idx] = value;
  return value;
}

for (let i = 0; i < K; i++) {
  searchBombValue(i);
}

let out = combination(N + M, N);
for (let i = 0; i < K; i++) {
  const [bx, by] = bombs[i];
  const [dx, dy] = [N - bx, M - by];
  out = (out - (combination(dx + dy, dx) * bombValues[i] % p) + p) % p;
}

// output
return out + "";
}
