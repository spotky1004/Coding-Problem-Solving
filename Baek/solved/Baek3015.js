const isDev = process?.platform !== "linux";
const [N, ...heights] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`14
7
7
8
6
5
3
7
4
7
7
10
6
1
2`
)
  .trim()
  .split("\n")
  .map(Number);

function upperBound(arr, v) {
  let left = -1, right = arr.length;
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] > v) left = mid;
    else right = mid;
  }
  return right;
}



let count = 0;
const stack = [];
for (let i = 0; i < N; i++) {
  const curHeight = heights[i];

  while (stack[stack.length - 1] < curHeight) {
    count++;
    stack.pop();
  }
  if (stack[stack.length - 1] < curHeight) {
    count += stack.length;
  } else if (stack.length !== 0) {
    count += Math.min(stack.length, 1 + (stack.length - upperBound(stack, curHeight)));
  }
  stack.push(curHeight);
}
console.log(count);
