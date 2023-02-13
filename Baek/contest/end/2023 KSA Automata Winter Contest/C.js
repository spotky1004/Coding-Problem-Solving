const isDev = process?.platform !== "linux";
const [[N], a] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
0 2 2`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const pows = [
  [1, 0],
  [0, 1],
  [-1, -1]
];

let p = 0;
let q = 0;
for (let i = 0; i < a.length; i++) {
  const powIdx = a[i] % 3;
  const [dq, dp] = pows[powIdx];
  p += dp;
  q += dq;
}

console.log(p + " " + q);
