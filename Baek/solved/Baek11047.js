const isDev = process?.platform !== "linux";
let [[N, K], ...coins] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10 4200
1
5
10
50
100
500
1000
5000
10000
50000`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

coins = coins.flat();
let count = 0;
for (let i = N - 1; i >= 0; i--) {
  const coin = coins[i];
  count += Math.floor(K / coin);
  K %= coin;
}
console.log(count);
