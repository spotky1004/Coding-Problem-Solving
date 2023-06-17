const isDev = process?.platform !== "linux";
const [[n], ...m] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
10
3
1024
100000000000000`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(BigInt));

let out = [];
for (const [t] of m) {
  if (t === 1n) {
    out.push("0 0");
    continue;
  }

  const oneIdxs = [];
  for (let i = 65; i >= 0; i--) {
    const mask = 2n**BigInt(i);
    if (t & mask) oneIdxs.push(i);
  }

  if (oneIdxs.length === 1) {
    out.push(`${oneIdxs[0] - 1} ${oneIdxs[0] - 1}`);
  } else {
    const aDiff = t - 2n**BigInt(oneIdxs[0]) - 2n**BigInt(oneIdxs[1]);
    const bDiff = -(t - 2n**BigInt(oneIdxs[0]) - 2n**BigInt(oneIdxs[1] + 1));
    if (aDiff <= bDiff) {
      out.push(`${oneIdxs[1]} ${oneIdxs[0]}`);
    } else {
      out.push(`${oneIdxs[1] + 1} ${oneIdxs[0]}`);
    }
  }
}
console.log(out.join("\n"));
