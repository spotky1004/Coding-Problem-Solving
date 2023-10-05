const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input);
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out.toString() === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out);
  }

// cases
check(`3
1 2
1 100
1 1`,
`1 2 100`);
check(`2
5 10 20 30 40 50
2 28 27`,
`10 20 28 27 30 40 50`);
check(`2
3 5 1 2
3 5 1 1`,
`5 1 1 5 1 2`);
check(`2
4 1 2 1 1
4 2 1 1 1`,
`1 2 1 1 1 2 1 1`);
check(`3
4 1 1 2 1
4 1 2 1 1
4 2 1 1 1`,
`1 1 1 2 1 1 1 2 1 1 2 1`);

let bigCase1 = `1000\n`;
for (let i = 0; i < 1000; i++) {
  bigCase1 += [1000, ...Array(1000).fill(1)].join(" ") + "\n";
}
check(bigCase1, Array(1000 * 1000).fill(1).join(" "));

let bigCase2 = `1000\n`;
for (let i = 0; i < 1000; i++) {
  bigCase2 += [1000, ...Array.from({ length: 1000 }, (_, i) => i + 1)].join(" ") + "\n";
}
check(bigCase2, Array.from({ length: 1000 * 1000 }, (_, i) => Math.floor(i / 1000) + 1).join(" "));
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[N], ...groups] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// code
groups.forEach(group => group.shift());

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

const groupHeap = new Heap((g1, g2) => {
  const maxLen = Math.max(g1.length, g2.length);
  for (let i = 0; i < maxLen; i++) {
    const e1 = g1[i];
    const e2 = g2[i];
    if (typeof e1 === "undefined") return 1;
    if (typeof e2 === "undefined") return -1;
    const d = e1 - e2;
    if (d !== 0) return d;
  }
});

for (let i = 0; i < N; i++) {
  groupHeap.push(groups[i]);
}

const out = [];
while (groupHeap.size > 0) {
  const g = groupHeap.pop();
  out.push(g.shift());
  if (g.length > 0) groupHeap.push(g);
}

// output
return out.join(" ");
}
