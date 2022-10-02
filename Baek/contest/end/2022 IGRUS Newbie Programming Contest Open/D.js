const isDev = process.platform !== "linux";
const [[N], jumps] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`9
0 1 0 2 1 0 0 3 0`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const ans = Array(N);
const stack = [];
for (let i = N - 1; i >= 0; i--) {
  const jump = jumps[i];
  if (jump !== 0) {
    while (true) {
      if (stack.length === 0 || stack[stack.length - 1] > i + jump) break;
      const removed = stack.pop();
      const removedJump = jumps[removed];
      if (removedJump === 0) continue;
      
    }
  }
  stack.push(i);
  ans[i] = stack.length;
}

console.log(ans.join(" "));