const isDev = process?.platform !== "linux";
const [[T], ...cases] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
10 12 3 9
10 12 7 2
13 11 5 6`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];
loop: for (let [M, N, x, y] of cases) {
  if (M > N) [N, M, y, x] = [M, N, x, y];

  let t = x - 1;
  for (let i = 0; i < N; i++) {
    const u = t % N;
    if (u === y - 1) {
      out.push(t + 1);
      continue loop;
    }
    t += M;
  }
  out.push(-1);
}
console.log(out.join("\n"));
