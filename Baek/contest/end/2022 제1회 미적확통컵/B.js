const isDev = process?.platform !== "linux";
let [[b, c, a1, a2]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1 1 1 1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

for (let i = 0; i < 10000; i++) {
  [a1, a2] = [b*a1 + c*a2, a1];
  if (a1 > 1e295) {
    a1 /= 1e295;
    a2 /= 1e295;
  }
}

console.log(a1/a2);
