const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const minTreeCount = Math.ceil(N / 2);
const edges = [];
function fixIdx(idx) {
  return (idx + N - 1) % N + 1;
}
function addTree(startNode) {
  edges.push(fixIdx(startNode) + " " +fixIdx(startNode + 1));

  let curNode = fixIdx(startNode + 1);
  let leftNode = fixIdx(startNode + 2);
  let rightNode = fixIdx(startNode - 1);
  let isLeft = false;
  for (let i = 0; i < N - 3; i++) {
    if (isLeft) {
      edges.push(curNode + " " + leftNode);
      curNode = leftNode;
      leftNode = fixIdx(leftNode + 1);
    } else {
      edges.push(curNode + " " + rightNode);
      curNode = rightNode;
      rightNode = fixIdx(rightNode - 1);
    }
    
    isLeft = !isLeft;
  }

  if (N !== 2) {
    edges.push(curNode + " " + (isLeft ? leftNode : rightNode));
  }
}

if (N % 2 === 0) {
  for (let i = 1; i <= minTreeCount; i++) {
    addTree(i);
  }
} else {
  for (let i = 1; i <= minTreeCount - 1; i++) {
    addTree(i);
  }
  addTree(N);
}

console.log(minTreeCount + "\n" + edges.join("\n"));
