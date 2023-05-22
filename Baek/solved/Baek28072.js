const isDev = process?.platform !== "linux";
const [[N, K], a] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6 512
290 222 68 179 444 333
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const suffixArr = [];
suffixArr[0] = a[0] % K;
for (let i = 1; i < N; i++) {
  suffixArr.push((suffixArr[i - 1] + a[i]) % K);
}

const modAcc = Array(K).fill(0);
for (const modVal of suffixArr) {
  modAcc[(K - modVal) % K]++;
}

let maxPerson = modAcc[0];
let acc = 0;
for (let i = 1; i < N; i++) {
  const startIdx = N - i;
  acc = (acc + a[startIdx]) % K;
  maxPerson = Math.max(maxPerson, modAcc[acc]);
}

console.log(maxPerson);
