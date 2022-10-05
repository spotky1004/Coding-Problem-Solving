const isDev = process.platform !== "linux";
const [[N], a, [x]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
1 1 1 1
2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let count = 0;
const numCount = Array(2000000+1).fill(0);
for (let i = 0; i < N; i++) {
  const num = a[i];
  const diff = x - num;
  
  if (diff > 0) {
    count += numCount[diff];
  }
  numCount[num]++;
}

console.log(count);
