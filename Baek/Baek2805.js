let input = `6 1
0 2 0 0 0 2`.trim().split("\n").map(e => e.split(" ").map(Number));
let [treeLength, tree] = [input[0][1], input[1]];

let s = 2**20-1;
const checkFunc = (a,b) => a+Math.max(0, b-s);
for (let i = 19; i >= 0; i--) {
    let tmpLength = tree.reduce(checkFunc, 0);
    s += ((treeLength < tmpLength)*2-1)*2**i;
}
if (treeLength < tree.reduce(checkFunc, 0)) s++;
if (treeLength > tree.reduce(checkFunc, 0)) s--;
console.log(tree.reduce(checkFunc, 0), s);
//console.log(s);