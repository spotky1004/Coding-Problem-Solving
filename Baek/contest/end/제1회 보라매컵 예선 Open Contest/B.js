const isDev = process?.platform !== "linux";
const [[N], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8
1 1
2 1
1 1
4 1
3 0
5 1
4 0
1 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const army = Array(200_001).fill(0);
let count = 0;
for (const [idx, status] of datas) {
  if (status^army[idx]) {
    army[idx] ^= 1;
  } else {
    count++;
  }
}

count += army.reduce((a, b) => a + b, 0);
console.log(count);
