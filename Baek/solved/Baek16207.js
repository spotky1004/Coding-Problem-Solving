const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`9
10 3 4 4 4 5 6 6 6`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

void input.shift();
const sticks = input.shift().sort((a, b) => b - a);
let sides = [];
let sum = 0;
for (let i = 1; i < sticks.length; i++) {
  const prev = sticks[i - 1];
  const cur = sticks[i];

  if (Math.abs(prev - cur) <= 1) {
    sides.push(Math.min(prev, cur));
    i++;
    if (sides.length >= 2) {
      sum += (sides[0] ?? 0) * (sides[1] ?? 0);
      sides = [];
    }
  }
}

console.log(sum);
