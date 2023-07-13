const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Heap {
  tree = [null];
  compFunc = (a, b) => a - b;

  constructor(compFunc) {
    if (compFunc) this.compFunc = compFunc;
  }

  first() {
    return this.tree[1];
  }

  get size() {
    return this.tree.length - 1;
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

const minHeap = new Heap((a, b) => a - b);
const minDelHeap = new Heap((a, b) => a - b);
const maxHeap = new Heap((a, b) => b - a);
const maxDelHeap = new Heap((a, b) => b - a);



let l = -1;
let commandCount = -1;
const out = [];
rl.on('line', function(line) {
  l++;
  if (l === 0 || line === "") return;
  if (commandCount <= 0) {
    commandCount = Number(line);
    while (minHeap.size > 0) minHeap.pop();
    while (minDelHeap.size > 0) minDelHeap.pop();
    while (maxHeap.size > 0) maxHeap.pop();
    while (maxDelHeap.size > 0) maxDelHeap.pop();
    if (commandCount === 0) out.push("EMPTY");
    return;
  }
  commandCount--;

  const [cmd, param] = line.split(" ");
  if (cmd === "I") {
    minHeap.push(param);
    maxHeap.push(param);
  } else if (cmd === "D") {
    if (param === "1" && maxHeap.size !== 0) {
      while (
        maxDelHeap.size > 0 &&
        maxDelHeap.first() === maxHeap.first()
      ) {
        maxHeap.pop();
        maxDelHeap.pop();
      }
      minDelHeap.push(maxHeap.pop());
      while (
        maxDelHeap.size > 0 &&
        maxDelHeap.first() === maxHeap.first()
      ) {
        maxHeap.pop();
        maxDelHeap.pop();
      }
    } else if (param === "-1" && minHeap.size !== 0) {
      while (
        minDelHeap.size > 0 &&
        minDelHeap.first() === minHeap.first()
      ) {
        minHeap.pop();
        minDelHeap.pop();
      }
      maxDelHeap.push(minHeap.pop());
      while (
        minDelHeap.size > 0 &&
        minDelHeap.first() === minHeap.first()
      ) {
        minHeap.pop();
        minDelHeap.pop();
      }
    }
  }

  while (
    maxDelHeap.size > 0 &&
    maxDelHeap.first() === maxHeap.first()
  ) {
    maxHeap.pop();
    maxDelHeap.pop();
  }
  while (
    minDelHeap.size > 0 &&
    minDelHeap.first() === minHeap.first()
  ) {
    minHeap.pop();
    minDelHeap.pop();
  }

  if (commandCount === 0) {
    if (
      minHeap.size === 0 ||
      maxHeap.size === 0
    ) {
      out.push("EMPTY");
    } else {
      out.push(maxHeap.first() + " " + minHeap.first());
    }
    commandCount = -1;
  }
}).on("close", function() {
  console.log(out.join("\n"));
  process.exit();
});
