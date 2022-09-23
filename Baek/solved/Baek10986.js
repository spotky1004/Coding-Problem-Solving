const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 3
1 2 3 1 2
`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

const [N, M] = input.shift();
const a = input.shift();
const sum = [a[0] % M];
for (let i = 1; i < N; i++) {
  sum.push((sum[i - 1] + a[i]) % M);
}

const modAcc = Array(M).fill(0);
for (let i = 0; i < N; i++) {
  modAcc[sum[i]]++;
}

let count = 0n;
for (let i = 0; i < M; i++) {
  const numberCount = BigInt(modAcc[i]);

  if (numberCount >= 1n) {
    if (i === 0) {
      count += (numberCount)*(numberCount + 1n)/2n;
    } else {
      count += (numberCount - 1n)*(numberCount)/2n;
    }
  }
}

console.log(count.toString());
