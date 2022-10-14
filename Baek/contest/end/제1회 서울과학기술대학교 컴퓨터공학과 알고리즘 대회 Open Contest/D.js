const isDev = process.platform !== "linux";
const [, youjunjas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
GG FD AB
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(v => Array.from(v).map(c => c.charCodeAt(0))));

const avaiables = new Set();
for (let i = 0; i < youjunjas.length; i++) {
  const a = youjunjas[i];
  if (avaiables.has(a[0]) && avaiables.has(a[1])) continue;
  for (let j = 0; j < youjunjas.length; j++) {
    if (i === j) continue;
    const b = youjunjas[j];
    if (avaiables.has(b[0]) && avaiables.has(b[1])) continue;
    const val1 = Math.max(a[0], b[1]);
    const val2 = Math.max(a[1], b[0]);
    avaiables.add(val1);
    avaiables.add(val2);
  }
}

console.log(avaiables.size + "\n" + [...avaiables.values()].sort((a, b) => a - b).map(v => String.fromCharCode(v)).join(" "));
