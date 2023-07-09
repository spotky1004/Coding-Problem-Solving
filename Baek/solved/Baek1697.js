const isDev = process?.platform !== "linux";
const [[N, K]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 17`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const time = Array(100000 + 1).fill(-1);
time[N] = 0;
const queue = [N];
loop: for (const n of queue) {
  const curTime = time[n];

  for (const t of [n - 1, n + 1, n * 2]) {
    if (time[t] !== -1) continue;
    time[t] = curTime + 1;
    if (t === K) break loop;
    queue.push(t);
  }
}

console.log(time[K]);
