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
check(`3
5 555
8 195
13 651
15`,
`750`);
check(`3
5 555
8 195
13 751
15`,
`751`);
check(`6
55 1562
5 814
55 1962
8 996
2 716
34 1792
94`,
`4568`);
check(`1
13 89
1`,
`0`);
check(`3
27777890035288 9419696870097445
53316291173 6312623457097563
165580141 8848283653257131
27777900000000`,
`15160907110354694`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [[N], ...items] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));
N = Number(N);
const [C] = items.pop();

// code
const max = (a, b) => a > b ? a : b;

items.sort((a, b) => Number(b[1] - a[1])).sort((a, b) => Number(b[0] - a[0]));
const weightPrefixSum = [items[0][0]], valuePrefixSum = [items[0][1]];
for (let i = 1; i < N; i++) {
  weightPrefixSum.push(weightPrefixSum[i - 1] + items[i][0]);
  valuePrefixSum.push(valuePrefixSum[i - 1] + items[i][1]);
}
function search(idx = 0, left = C, valueSum = 0n) {
  if (idx === N) return valueSum;
  if (left >= weightPrefixSum[N - 1] - (idx !== 0 ? weightPrefixSum[idx - 1] : 0n)) {
    return valueSum + valuePrefixSum[N - 1] - (idx !== 0 ? valuePrefixSum[idx - 1] : 0n);
  } else {
    let maxValueSum = 0n;
    const weight = items[idx][0];
    const mergedItems = [[0n, 0n]];
    while (idx !== N && items[idx][0] === weight) {
      const [prevWeight, prevValue] = mergedItems[mergedItems.length - 1];
      const [curWeight, curValue] = items[idx];
      mergedItems.push([prevWeight + curWeight, prevValue + curValue]);
      idx++;
    }
    for (const [weight, value] of mergedItems) {
      if (weight > left) continue;
      maxValueSum = max(maxValueSum, search(idx, left - weight, valueSum + value));
    }
    return maxValueSum;
  }
}

// output
return search();
}
