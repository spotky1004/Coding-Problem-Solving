const isDev = process?.platform !== "linux";
const [[N, M], [S]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 4
KSIIC`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

let t = S;
while (["A", "E", "I", "O", "U"].includes(t[t.length - 1])) {
  t = t.slice(0, t.length - 1);
}
const lastChar = t[t.length - 1];
t = t.slice(0, t.length - 1);

let aIdx = [];
for (let i = t.length - 1; i >= 0; i--) {
  const char = t[i];
  if (char === "A") {
    aIdx.push(i);
    if (aIdx.length >= 2) break;
  }
}

if (
  aIdx.length >= 2 &&
  aIdx[1] >= M - 4
) {
  const toUse = t.slice(0, aIdx[1]);
  console.log(`YES\n` + toUse.slice(0, M - 3) + "AA" + lastChar);
} else {
  console.log("NO");
}
