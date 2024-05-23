const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  require('node:v8').setFlagsFromString('--stack-size=262144');
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=262144');

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
check(`2
2
1 2 1
1 2 0
2
1 2 1
2 1 1`,
`NO
YES`);
check(`2
3
1 2 1
2 3 1
3 1 1
4
1 2 1
2 3 1
3 4 1
1 4 0`,
`YES
NO`);
check(`10
99999
${"1000000000 1000000000 0\n".repeat(99999)}99999
${"1000000000 1000000000 0\n".repeat(99999)}99999
${"1000000000 1000000000 0\n".repeat(99999)}99999
${"1000000000 1000000000 0\n".repeat(99999)}99999
${"1000000000 1000000000 0\n".repeat(99999)}99999
${"1000000000 1000000000 0\n".repeat(99999)}99999
${"1000000000 1000000000 0\n".repeat(99999)}99999
${"1000000000 1000000000 0\n".repeat(99999)}99999
${"1000000000 1000000000 0\n".repeat(99999)}99999
${"1000000000 1000000000 0\n".repeat(99999)}`,
`NO\n`.repeat(10).trim());
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let lines = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
lines = lines.reverse().filter(v => v.length > 1 || v[0] !== 0);
const [t] = lines.pop();
const cases = [];
for (let i = 0; i < t; i++) {
  const caseValues = [];
  cases.push(caseValues);
  caseValues.push(lines.pop());
  while (lines.length > 0 && lines[lines.length - 1].length === 3) caseValues.push(lines.pop());
}
const out = [];
caseLoop: for (let caseNr = 0; caseNr < t; caseNr++) {
  /**
   * @param {number} a 
  */
  function find(a, depth = 1) {
    if (depth >= 100) throw "!";
    if (roots[a] === a) return a;

    const root = find(roots[a], depth + 1);
    roots[a] = root;
    return root;
  }

  /**
   * @param {number} a 
   * @param {number} b 
  */
  function union(a, b){
    a = find(a);
    b = find(b);

    if (a === b) return;

    if (rank[a] < rank[b]) {
      roots[a] = b;
    } else {
      roots[b] = a;
      if (rank[a] === rank[b]) {
        rank[a]++;
      }
    }
  }



  const [[n], ...rawConds] = cases[caseNr];
  const conds = rawConds;
  const valueSet = new Set();
  for (const cond of conds) valueSet.add(cond[0]), valueSet.add(cond[1]);
  const valueMap = new Map();
  let idx = 0;
  for (const v of valueSet) valueMap.set(v, idx++);

  const rank = Array.from({ length : valueSet.size }, _ => 1);
  const roots = Array.from({ length: valueSet.size }, (_, i) => i);

  for (const [i, j, e] of conds) {
    if (e === 0) continue;
    union(valueMap.get(i), valueMap.get(j));
  }
  for (const [i, j, e] of conds) {
    if (e === 1) continue;
    if (find(valueMap.get(i)) === find(valueMap.get(j))) {
      out.push("NO");
      continue caseLoop;
    }
  }
  out.push("YES");
}

// output
return out.join("\n");
}
