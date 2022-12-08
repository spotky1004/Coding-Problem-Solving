const isDev = process.platform !== "linux";
const [[N, M], s, ...table] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3 2
200 400 100
0 40 30 10 20
60 0 50 20 40
0 10 0 30 40`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = s.concat(Array(M).fill(0));
for (let i = 0; i < table.length; i++) {
  const row = table[i];
  for (let j = 0; j < row.length; j++) {
    out[j] += row[j];
    out[i] -= row[j];
  }
}

console.log(out.join(" "));
