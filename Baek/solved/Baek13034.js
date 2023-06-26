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

const g = [0, 0];
for (let i = g.length; i <= 1000; i++) {
  const G = new Set();
  for (let j = 0; j < Math.floor(i / 2); j++) {
    G.add((g[j] ?? 0) ^ (g[i - j - 2] ?? 0));
  }
  
  let v = 0;
  while (true) {
    if (G.has(v)) v++;
    else break;
  }
  g.push(v);
}

console.log(g[N] !== 0 ? "1" : "2");
