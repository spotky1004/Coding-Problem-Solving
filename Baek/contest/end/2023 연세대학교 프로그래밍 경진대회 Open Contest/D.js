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
check(`input`,
`answer`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
function SCC(nodeAdj) {
  const V = nodeAdj.length;
  const finished = Array(V).fill(false);
  let idAcc = 0;
  const ids = Array(V).fill(-1);

  const SCC = [];
  const stack = [];

  function impl(u) {
    const id = idAcc++;
    ids[u] = id;
    stack.push(u);

    const adj = nodeAdj[u];
    for (const v of adj) {
      if (finished[v] || u === v) continue;
      if (ids[v] !== -1) {
        ids[u] = Math.min(ids[u], ids[v]);
      } else {
        const toSearch = impl(v);
        if (toSearch !== -2) {
          ids[u] = Math.min(ids[u], ids[v]);
        }
      }
    }

    if (id !== ids[u]) return ids[u];

    const newSCC = [];
    while (newSCC[newSCC.length - 1] !== u) {
      const toPush = stack.pop();

      if (typeof toPush === "undefined") break;
      finished[toPush] = true;
      newSCC.push(toPush);
    }
    newSCC.sort((a, b) => a - b);
    SCC.push(newSCC);
    return -1;
  }
  for (let i = 0; i < V; i++) {
    if (finished[i]) continue;
    impl(i);
  }

  return SCC;
}

// output
return "answer";
}
