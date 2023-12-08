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
check(`4
CCCA
CCCB
CCCD
CCCE`,
`CCCACCCBCCCCCCDE`);
check(`5
KOOSAGA
XIAOWUC
DOTORYA
CKI
THENITROMEFAN`,
`CDKIKOOOSAGATHENITORTROMEFANXIAOWUCYA`);
check(`5
BKSDSOPTDD
DDODEVNKL
XX
PODEEE
LQQWRT`,
`BDDKLODEPODEEEQQSDSOPTDDVNKLWRTXX`);
check(`5
QITHSQARQV
BYLHVGMLRY
LKMAQTJEAM
AQYICVNIKK
HKGZZFFEWC`,
`ABHKGLKMAQIQQTHSQARQTJEAMVYICVNIKKYLHVGMLRYZZFFEWC`);
check(`5
XHCYBTUQUW
EKBISADSSN
LOOISPOFAK
MIXBDHPJUQ
BNMNDHMOTC`,
`BEKBILMINMNDHMOOIOSADSPOFAKSSNTCXBDHPJUQXHCYBTUQUW`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
let [N, ...words] = input
  .trim()
  .split("\n");
N = Number(N);

// code
class Heap {
  tree = [null];
  compFunc = (a, b) => a - b;

  constructor(compFunc) {
    if (compFunc) this.compFunc = compFunc;
  }

  get size() {
    return this.tree.length - 1;
  }

  first() {
    return this.tree[1];
  }

  push(v) {
    const tree = this.tree;
    const compFunc = this.compFunc;

    let curIdx = tree.length;
    tree.push(v);
    while (curIdx !== 1) {
      const parentIdx = Math.floor(curIdx / 2);
      if (compFunc(v, tree[parentIdx]) >= 0) break;
      this.swap(curIdx, parentIdx);
      curIdx = parentIdx;
    }
  }

  pop() {
    const tree = this.tree;
    const compFunc = this.compFunc;
    if (tree.length === 1) return null;
    
    const popedNode = tree[1];
    if (tree.length === 2) {
      this.tree = [null];
      return popedNode;
    }
    
    const lastNode = tree.pop();
    tree[1] = lastNode;
    let curIdx = 1;
    while (true) {
      const childIdx = tree.length <= curIdx * 2 + 1 || compFunc(tree[curIdx * 2], tree[curIdx * 2 + 1]) <= 0 ? curIdx * 2 : curIdx * 2 + 1;
      if (
        tree.length <= childIdx ||
        compFunc(lastNode, tree[childIdx]) <= 0
      ) break;
      this.swap(curIdx, childIdx);
      curIdx = childIdx;
    }
    
    return popedNode;
  }

  swap(a, b) {
    const tmp = this.tree[b];
    this.tree[b] = this.tree[a];
    this.tree[a] = tmp;
  }
}



const out = [];
const startPoses = Array(N).fill(0);
const heap = new Heap((a, b) => (a[0] + b[0]).localeCompare(b[0] + a[0]));
for (let i = 0; i < N; i++) {
  const word = words[i];
  for (let j = 1; j <= word.length; j++) {
    heap.push([word.slice(0, j), 0, i]);
  }
}
while (heap.size > 0) {
  while (
    heap.size > 0 &&
    heap.first()[1] < startPoses[heap.first()[2]]
  ) {
    heap.pop();
  }
  if (heap.size === 0) break;

  const [toAdd, startPos, idx] = heap.pop();
  out.push(toAdd);
  const newStartPos = startPos + toAdd.length;
  startPoses[idx] = newStartPos;
  const word = words[idx];
  for (let i = newStartPos + 1; i <= words[idx].length; i++) {
    heap.push([word.slice(newStartPos, i), newStartPos, idx]);
  }
}

// output
return out.join("");
}
