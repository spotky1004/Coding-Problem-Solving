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
check(`2 4`, `5`);
check(`3 5`, `96`);
check(`4 2`, `1`);
check(`4 36`, `3`);
check(`6 7`, `3`);
check(`999999 1000000`, `3000004000001`);
check(`1000000 1000000`, `3`);
check(`5 10`, `341`);
check(`5 50`, `7229`);
check(`7 50`, `7457`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[n, m]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const mul = 10n**50n;

const sqrt = (x) => {
  const xm = x * mul;
  let out = mul;
  for (let i = 0; i < 7; i++) {
    out = (out + xm / out) / 2n;
  }
  return out;
}
const pow = (x, y) => {
  let out = mul;
  let dec = y % mul;
  let int = (y - dec) / mul;

  if (int !== 0n) {
    let m = x;
    while (int > 0n) {
      if (int & 1n) out = out * m / mul;
      m = m * m / mul;
      int /= 2n;
    }
  }
  if (dec !== 0n) {
    let m = x;
    let p = mul;
    while (dec > 0n && p > 1n) {
      if (dec >= p) {
        dec -= p;
        out = out * m / mul;
      }
      m = sqrt(m);
      p /= 2n;
    }
  }

  return out;
}
const abs = (x) => x < 0n ? -x : x;
const floor = (x) => {
  const dec = x % mul;
  if (mul <= dec + 100n) return x - dec + mul;
  return x - dec;
}

function binSearch(arr, v) {
  let left = 0, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === v) return mid;
    else if (arr[mid] < v) left = mid;
    else right = mid;
  }
  return left;
}

let count = 0;
if (n % 2 === 0) {
  count++;
  let x = 1;
  while (true) {
    const p = -n * x ** (n - 1);
    const q = x ** n + p * x;
    if (Math.abs(p) > m || Math.abs(q) > m) break;
    count += 2;
    x++;
  }
} else {
  count += (m + 1) * (2 * m + 1);

  const qRanges = [1];
  for (let q = 1; q <= m; q++) {
    qRanges.push(Math.ceil(Math.max(1, Math.abs((q * n ** (n / (n - 1))) / (1 - n)) ** ((n - 1) / n))));
  }

  const bigN = BigInt(n);
  const bigNMul = mul * bigN;
  const pointPow = mul / (bigN - 1n);
  for (let p = -m; p < 0; p++) {
    const point = (Math.abs(p) / n) ** (1 / (n - 1));
    const value = Math.abs(point ** n + p * point);

    const minQ1 = Math.floor(Math.abs(value));
    const minQ2 = binSearch(qRanges, -p);
    if (
      minQ1 === minQ2 &&
      Math.floor((value % 1) * 1.00001) === 0
    ) {
      count += 2 * Math.max(0, m - minQ1);
    } else {
      const bigP = BigInt(p);
      const point = pow(-bigP * mul / bigN, pointPow);
      const value = pow(point, bigNMul) + bigP * point;
      count += 2 * Math.max(0, m - Number(floor(abs(value)) / mul));
    }
  }
}

// output
return count;
}
