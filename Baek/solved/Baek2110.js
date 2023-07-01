const isDev = process?.platform !== "linux";
const [[N, C], ...houses] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 2
1
102`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

houses.sort((a, b) => a - b);
const houseDists = [];
for (let i = 1; i < N; i++) {
  houseDists.push(houses[i] - houses[i - 1]);
}

let l = -1, r = Math.ceil((houses[N - 1] - houses[0] + 1) / (C - 1)) + 1;
while (l + 1 < r) {
  const m = Math.ceil((l + r) / 2);
  let c = 1;
  let dist = 0;
  for (let i = 0; i < N; i++) {
    dist += houseDists[i];
    if (dist >= m) {
      c++;
      dist = 0;
    }
  }
  if (c >= C) l = m;
  else r = m;
}
console.log(l);
