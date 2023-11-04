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
check(`3
a
aba
ababa`,
`3`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [N, ...S] = input
  .trim()
  .split("\n");
N = Number(N);

// code
let groups = [[...S.map(si => Array.from(si).reverse().join(""))]];
let count = 0;
let i = 0;
while (groups.length > 0) {
  const newGroups = [];
  for (const group of groups) {
    const checked = Array(group.length).fill(false);
    for (let j = 0; j < group.length; j++) {
      if (checked[j]) continue;
      checked[j] = true;
      
      const c = group[j][i];
      if (typeof c === "undefined") continue;

      const newGroup = [group[j]];
      newGroups.push(newGroup);
      let xorCount = 1;
      for (let k = j + 1; k < group.length; k++) {
        if (c === group[k][i]) {
          checked[k] = true;
          xorCount ^= 1;
          newGroup.push(group[k]);
        }
      }
      count += xorCount;
    }
  }

  groups = newGroups;
  i++;
}

// output
return count;
}
