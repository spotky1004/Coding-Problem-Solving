const isDev = process?.platform !== "linux";
const [[N], ...names] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
leeminhee
minheejin
jinmichae`
)
  .trim()
  .split("\n");

let count = 0;
for (let i = 0; i < names.length; i++) {
  const a = names[i];
  const aFrontSlice = Array.from({ length: a.length }, (_, i) => a.slice(0, i + 1));
  const aBackSlice = Array.from({ length: a.length }, (_, i) => a.slice(i, a.length)).reverse();
  for (let j = i + 1; j < names.length; j++) {
    const b = names[j];
    const bFrontSlice = Array.from({ length: b.length }, (_, i) => b.slice(0, i + 1));
    const bBackSlice = Array.from({ length: b.length }, (_, i) => b.slice(i, b.length)).reverse();

    if (
      aFrontSlice.findIndex((v, i) => v === bBackSlice[i]) !== -1 ||
      aBackSlice.findIndex((v, i) => v === bFrontSlice[i]) !== -1
    ) {
      count++;
    }
  }
}

console.log(count);
