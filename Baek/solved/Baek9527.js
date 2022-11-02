const isDev = process.platform !== "linux";
const [[A, B]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 12`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

const maxBinLength = Math.ceil(Math.log2(1e16));
const oneSum = [1n];
for (let i = 1; i < maxBinLength; i++) {
  oneSum[i] = 2n*(oneSum[i - 1] - 1n) + 2n**BigInt(i - 1) + 1n;
}

function getOneCount(x) {
  const bin = Array.from(x.toString(2)).reverse();
  let count = 0n;
  let preOneCount = 0n;
  for (let i = bin.length - 1; i >= 0; i--) {
    if (bin[i] === "0") continue;
    count += preOneCount * 2n**BigInt(i) + oneSum[i];
    preOneCount++;
  }
  return count;
}

console.log((getOneCount(B) - getOneCount(A - 1n)).toString());
