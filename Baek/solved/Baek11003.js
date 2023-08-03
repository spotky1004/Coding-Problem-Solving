const isDev = process?.platform !== "linux";
const [[L, N], A] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`12 3
1 5 2 3 6 2 3 7 3 5 2 6`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let stackIdx = 0;
const stack = [];
let out = [];
for (let i = 0; i < L; i++) {
  const v = A[i];
  while (
    stack.length !== 0 &&
    stack[stack.length - 1][1] > i - N &&
    stack[stack.length - 1][0] > v
  ) {
    stack.pop();
  }
  stack.push([v, i]);
  if (stack[stackIdx][1] <= i - N) stackIdx++;
  out.push(stack[stackIdx][0]);
  if (out.length >= 1e5) {
    process.stdout.write(out.join(" ") + " ");
    out = [];
  }
}
console.log(out.join(" "));
