const isDev = process?.platform !== "linux";
const [[C], M] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10
1 2 2 2 1 2 3 3 2 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];
const nums = [];
for (let i = 0; i < C; i++) {
  const depth = M[i] - 1;
  if (depth > nums.length) {
    console.log(-1);
    process.exit(0);
  } else if (depth < nums.length - 1) {
    while (depth < nums.length - 1) nums.pop();
  } else if (depth !== nums.length - 1) {
    nums.push(0);
  }
  nums[depth]++;
  out.push(nums[depth]);
}

console.log(out.join(" "));
