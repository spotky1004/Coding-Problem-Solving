const isDev = process.platform !== "linux";
const [[V], preOrder, postOrder] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 2 3
1 3 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let out = "";
/** @type {[preStart: number, preEnd: number, postStart: number, postEnd: number][]} */
const stack = [[0, preOrder.length, 0, postOrder.length]];
while (stack.length > 0) {
  const [preStart, preEnd, postStart, postEnd] = stack.pop();
  if (preEnd - preStart === 0) continue;
  if (preEnd - preStart <= 1) {
    out += preOrder[preStart] ? preOrder[preStart] + " " : "";
    continue;
  }
  const root = postOrder[postEnd - 1];
  const rootIdx = preOrder.findIndex(v => v === root);
  out += preOrder[rootIdx] + " ";
  const preLeftLength = rootIdx - preStart;
  stack.push([
    rootIdx + 1, preEnd,
    postStart + preLeftLength, postEnd - 1
  ]);
  stack.push([
    preStart, rootIdx,
    postStart, postStart + preLeftLength
  ]);
}

console.log(out.trim());
