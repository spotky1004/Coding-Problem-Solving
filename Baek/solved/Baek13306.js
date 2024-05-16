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
check(`3 3
1
1
1 2 3
0 3
1 2 3
1 1 2
0 2`,
`YES
NO
YES`);
check(`11 5
7
4
1
9
11
1
11
1
3
7
0 11
1 8 5
1 3 9
0 10
0 9
0 7
1 2 7
0 5
1 1 10
0 8
0 6
0 2
1 1 3
0 3
0 4`,
`NO
YES
YES
NO
YES`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N, Q], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const rank = Array.from({ length : N + 1 }, _ => 1);
const roots = Array.from({ length: N + 1 }, (_, i) => i);

/**
 * @param {number} a 
*/
function find(a) {
  if (roots[a] === a) return a;

  const root = find(roots[a]);
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



let line = 0;
const parent = [null, null];
for (let i = 2; i <= N; i++) parent.push(lines[line++]);
const cutEdge = Array(N + 1).fill(false);

const queries = [];
for (let i = N + Q - 2; i >= 0; i--) {
  const query = lines[line++];
  if (query[0] === 0) cutEdge[query[1]] = true;
  queries.push(query);
}

for (let i = 2; i <= N; i++) {
  if (cutEdge[i]) continue;
  union(i, parent[i]);
}

const out = [];
for (let i = queries.length - 1; i >= 0; i--) {
  const [x, p1, p2] = queries[i];
  if (x === 0) union(p1, parent[p1]);
  else out.push(find(p1) === find(p2) ? "YES" : "NO");
}

// output
return out.reverse().join("\n");
}
