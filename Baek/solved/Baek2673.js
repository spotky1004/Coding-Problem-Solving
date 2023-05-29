const isDev = process?.platform !== "linux";
const [[N], ...chords] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
97 31
1 45
27 5
11 65
43 72`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number).sort((a, b) => a - b));

const connections = Array.from({ length: N }, _ => []);
for (let i = 0; i < N; i++) {
  const [a1, b1] = chords[i];
  for (let j = 0; j < N; j++) {
    const [a2, b2] = chords[j];
    if (
      (a1 < a2 && b2 < b1) ||
      (
        (b1 < b2 || b2 < a1) &&
        (b1 < a2 || a2 < a1)
      )
    ) connections[i].push(j);
  }
}

function search(idx1, idx2) {
  const cliqueNodes = [idx1,  idx2];
  for (let i = 0; i < N; i++) {
    const connection = connections[i];
    if (
      cliqueNodes.includes(i) ||
      !cliqueNodes.every(v => connection.includes(v))
    ) continue;
    cliqueNodes.push(i);
  }
  return cliqueNodes.length;
}

let max = 1;
for (let i = 0; i < N; i++) {
  for (const c of connections[i]) {
    max = Math.max(max, search(i, c));
  }
}

console.log(max);
