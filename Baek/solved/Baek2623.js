const isDev = process.platform !== "linux";
const [[N], ...lists] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6 3
3 1 4 3
4 6 2 5 4
2 2 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

lists.forEach(v => v.shift());
class Node {
  /** @type {number} */
  n
  /** @type {Node[]} */
  parents = [];
  /** @type {Node[]} */
  childs = [];

  constructor(n) {
    this.n = n;
  }
  
  addParent(parent) {
    if (this.parents.includes(parent)) return;
    this.parents.push(parent);
  }

  removeParent(parent) {
    const idx = this.parents.findIndex(n => n === parent);
    if (idx === -1) return;
    this.parents.splice(idx, 1);
  }

  addChild(child) {
    if (this.childs.includes(child)) return;
    this.childs.push(child);
  }
}

const singers = Array.from({ length: N + 1 }, (_, i) => new Node(i));
for (const list of lists) {
  for (let i = 1; i < list.length; i++) {
    const parent = singers[list[i - 1]];
    const child = singers[list[i]];
    parent.addChild(child);
    child.addParent(parent);
  }
}

singers.shift();
let ans = [];
while (ans.length < singers.length) {
  const idx = singers.findIndex(v => v && v.parents.length === 0);
  const toRemove = singers[idx];
  if (!toRemove) break;
  ans.push(toRemove.n);
  toRemove.childs.forEach(n => n.removeParent(toRemove));
  singers[idx] = null;
}

if (ans.length < singers.length) {
  console.log(0);
} else {
  console.log(ans.join("\n"));
}
