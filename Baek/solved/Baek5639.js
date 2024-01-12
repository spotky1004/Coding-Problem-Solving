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
check(`50
30
24
5
28
45
98
52
60`,
`5
28
24
45
30
60
52
98
50`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const nums = input
  .trim()
  .split("\n")
  .map(Number);

// code
class Node {
  /** @type {number?} */
  key = null;
  /** @type {Node?} */
  parent = null;
  /** @type {Node?} */
  l = null;
  /** @type {Node?} */
  r = null;
  /** @type {[l: number, r: number]} */
  range = [-Infinity, Infinity];
  
  constructor(key) {
    this.key = key;
  }

  isInsetable(n) {
    return this.range[0] <= n && n <= this.range[1];
  }

  /**
   * @param {Node} node 
   */
  insertL(node) {
    this.l = node;

    node.parent = this;
    node.range[0] = this.range[0];
    node.range[1] = this.key - 1;
  }

  /**
   * @param {Node} node 
   */
  insertR(node) {
    this.r = node;
    
    node.parent = this;
    node.range[0] = this.key + 1;
    node.range[1] = this.range[1];
  }
}

const root = new Node(nums.shift());
let prevNode = root;
for (const num of nums) {
  const node = new Node(num);
  while (!prevNode.isInsetable(num)) prevNode = prevNode.parent;
  if (prevNode.key < num) prevNode.insertR(node);
  else prevNode.insertL(node);
  prevNode = node;
}

const out = [];
/**
 * @param {Node} node 
 */
function search(node) {
  if (node.l) search(node.l);
  if (node.r) search(node.r);
  out.push(node.key);
}
search(root);

// output
return out.join("\n");
}
