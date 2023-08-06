const isDev = process?.platform !== "linux";
const [...socks] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
8
6
3
8`
)
  .trim()
  .split("\n")
  .map(Number);

const sum = Array(10).fill(0);
for (const sock of socks) {
  sum[sock]++;
}

for (let i = 0; i < 10; i++) {
  if (sum[i] % 2 === 1) console.log(i);
}
