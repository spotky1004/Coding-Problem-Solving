let input = `7
A B C
B D .
C E F
E . .
F . G
D . .
G . .`.trim().split("\n").map(e => e.split(" "));

let tree = {};
for (let i = 0, l = +input.shift()[0]; i < l; i++) {
    let tempNode = input.shift();
    let node = tree[tempNode.shift()] = [];
    node.push(...tempNode);
}

let output = new Array(3).fill("");
function travel(node) {
    if (typeof node === "undefined" || node === ".") return;
    const edges = tree[node];
    output[0] += node;
    travel(edges[0]);
    travel(edges[1]);
    output[2] += node;
}
travel("A");

function inorderTravel(node) {
    if (typeof node === "undefined" || node === ".") return;
    const edges = tree[node];
    inorderTravel(edges[0]);
    output[1] += node;
    inorderTravel(edges[1]);
}
inorderTravel("A");

console.log(output.join("\n"));