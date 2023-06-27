const isDev = process?.platform !== "linux";
const [[N], Ps] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1
10`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const fibs = [1, 1];
while (true) {
  const newFib = fibs[fibs.length - 1] + fibs[fibs.length - 2];
  if (newFib > 3e6) break;
  fibs.push(newFib);
}

const g = [];
for (let i = 0; i <= 3e6; i++) {
  const G = [];
  for (let j = 0; j < fibs.length; j++) {
    const fib = fibs[j];
    if (fib > i) break;
    G.push(g[i - fib]);
  }
  
  let v = 0;
  while (true) {
    if (G.includes(v)) v++;
    else break;
  }
  g.push(v);
}

let sum = 0;
for (const P of Ps) {
  sum ^= g[P];
}
console.log(sum === 0 ? "cubelover" : "koosaga");
