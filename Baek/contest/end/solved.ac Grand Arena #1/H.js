const isDev = process?.platform !== "linux";
const [[N, M, Q], ...queries] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 2 3
1 2 1
2 2 2
1 3 -3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const row = Array(N).fill(0);
const col = Array(M).fill(0);

for (const [type, idx, v] of queries) {
  if (type === 1) {
    row[idx - 1] += v;
  } else if (type === 2) {
    col[idx - 1] += v;
  }
}

let totOut = [];
for (let i = 0; i < N; i++) {
  const rowSum = row[i];
  const out = [];
  for (let j = 0; j < M; j++) {
    out.push(rowSum + col[j]);
  }
  if (N < M) {
    console.log(out.join(" "));
  } else {
    totOut.push(out.join(" "));
    if (i !== 0 && i % 100000 === 0) {
      console.log(totOut.join("\n"));
      totOut = [];
    }
  }
}

if (totOut.length > 0) {
  console.log(totOut.join("\n"));
}
