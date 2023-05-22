const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const swSeq = [];
for (let i = 0; i < N; i++) {
  swSeq.push(i % 2 === 0 ? N - (i / 2) : (i + 1) / 2);
}
console.log(swSeq.join(" "));
