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
check(`5
1 2 3 4 5
1 2
2 3
3 4
4 5
`,
`Sejong`);
check(`4
1 2 1 3
1 2
3 4
4 2
`,
`Areum`);
/**
 * 1 1 1 1 -> 0
 * - 0 1 1 -> 0
 * - 0 - 0 -> 0
 * - 1 - - -> 1
 * 
 * 0 0 0 1 -> 1
 */
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], f, ...moves] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
const rank = Array.from({ length : N + 1 }, _ => 1);
const roots = Array.from({ length: N + 1 }, (_, i) => i);
const flowers = Array.from({ length: N + 1 }, (_, i) => new Map([[f[i - 1], 1]]));
const flowerG = Array(N + 1).fill(1);

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



const calcG = (x) => x === 0 ? 0 : ((x + 1) % 2) + 1;

let sumG = N % 2;
let G = sumG;
for (const [u, v] of moves) {
  const uSet = find(u);
  const vSet = find(v);
  union(u, v);
  const unionSet = find(u);
  
  sumG ^= flowerG[uSet] ^ flowerG[vSet];

  const uSetFlowers = flowers[uSet];
  const vSetFlowers = flowers[vSet];
  let newG;
  if (uSetFlowers.size < vSetFlowers.size) {
    newG = flowerG[vSet];

    for (const [type, count] of uSetFlowers) {
      if (!vSetFlowers.has(type)) vSetFlowers.set(type, 0);

      const prevCount = vSetFlowers.get(type);
      const newCount = prevCount + count;
      newG ^= calcG(prevCount) ^ calcG(newCount);
      vSetFlowers.set(type, newCount);
    }

    flowers[unionSet] = vSetFlowers;
  } else {
    newG = flowerG[uSet];

    for (const [type, count] of vSetFlowers) {
      if (!uSetFlowers.has(type)) uSetFlowers.set(type, 0);

      const prevCount = uSetFlowers.get(type);
      const newCount = prevCount + count;
      newG ^= calcG(prevCount) ^ calcG(newCount);
      uSetFlowers.set(type, newCount);
    }

    flowers[unionSet] = uSetFlowers;
  }
  sumG ^= newG;
  flowerG[unionSet] = newG;

  G ^= sumG;

  console.log(flowers[unionSet], sumG);
}

// output
return G !== 0 ? "Sejong" : "Areum";
}
