const isDev = process?.platform !== "linux";
const [[N], A] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
3 2 2 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

A.reverse();

if (A[0] === 1 && N === 1) {
  console.log(1);
  process.exit(0);
}
if (A[0] === 2 && N === 1) {
  console.log(`2\n1 2`);
  process.exit(0);
}
if (
  A[0] >= 3 ||
  !(A.every((v, i) => i === 0 || v >= A[i - 1])) ||
  A[1] === 1
) {
  console.log(-1);
  process.exit(0);
}

const edges = [];
let nextNode = 3;
let prevNodes = [];
let curNodes = [];
let nextNodes = [];
if (A[0] === 1) {
  edges.push("1 2");
  prevNodes.push(1);
  curNodes.push(2);
  nextNode = 3;
} else {
  edges.push("1 2");
  edges.push("1 3");
  edges.push("2 4");
  prevNodes.push(1);
  prevNodes.push(2);
  curNodes.push(3);
  curNodes.push(4);
  nextNode = 5;
}

for (let i = 1; i < N; i++) {
  leafCount = A[i];
  while (curNodes.length < leafCount) {
    edges.push(`${prevNodes[0]} ${nextNode}`);
    curNodes.push(nextNode++);
  }
  if (i !== N - 1) {
    for (let i = 0; i < curNodes.length; i++) {
      edges.push(`${curNodes[i]} ${nextNode}`);
      nextNodes.push(nextNode++);
    }
  }
  prevNodes = curNodes;
  curNodes = nextNodes;
  nextNodes = [];
}
console.log(`${nextNode - 1}\n` + edges.join("\n"));
