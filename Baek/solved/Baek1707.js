const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
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
check(`2
3 2
1 3
2 3
4 4
1 2
2 3
3 4
4 2`,
`YES
NO`);
check(`2
1 0
2 1
1 2`,
`YES
YES`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[K], ...lines] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
let line = 0;
const out = [];
testCase: while (line < lines.length) {
  const [V, E] = lines[line++];

  const connections = Array.from({ length: V }, _ => []);
  for (let i = 0; i < E; i++) {
    const [u, v] = lines[line++];
    connections[u - 1].push(v - 1);
    connections[v - 1].push(u - 1);
  }

  const setNr = Array(V).fill(-1);
  function search(node, depth = 0) {
    setNr[node] = depth % 2;
    let result = true;
    for (const nextNode of connections[node]) {
      if (setNr[nextNode] === setNr[node]) {
        result = false;
        break;
      }
      if (setNr[nextNode] === -1) {
        if (!search(nextNode, depth + 1)) {
          result = false;
          break;
        }
      }
    }
    return result;
  }

  for (let i = 0; i < V; i++) {
    if (setNr[i] !== -1) continue;
    const result = search(i);
    if (!result) {
      out.push("NO");
      continue testCase;
    }
  }
  out.push("YES");
}

// output
return out.join("\n");
}
