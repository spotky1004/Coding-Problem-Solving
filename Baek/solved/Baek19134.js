const isDev = process.platform !== "linux";
const [[n]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`30`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

// https://oeis.org/A035263
function getOneCount(n) {
  if (n <= 0n) return 0n;
  const bin = Array.from(n.toString(2));
  const acc = [1n];
  for (let i = 1; i < bin.length; i++) {
    acc[i] = acc[i - 1] * 2n + BigInt(bin[i]);
  }
  const diff = [1n];
  for (let i = 1; i < acc.length; i++) {
    diff.push(acc[i] - acc[i - 1]);
  }
  return diff.reverse().reduce((a, b, i) => a + (i % 2 ? 0n : b) , 0n);
}

const seqs = [
  "11101110", "11101010"
];
function solve(n) {
  const len = n / 8n;
  const oneCount = getOneCount(len);
  const lastSeq = Number(getOneCount(len + 1n) - oneCount);
  
  let out = 0n;
  out += oneCount * 5n;
  out += (n / 8n - oneCount) * 6n;
  const seq = seqs[lastSeq];
  for (let i = 0; i < Number(n % 8n); i++) {
    out += BigInt(seq[i]);
  }

  return out;
}

console.log(solve(n).toString());
