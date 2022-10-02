const isDev = process.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

let out = "int a;\nint *ptr = &a;";
for (let i = 1; i < N; i++) {
  out += `\nint ${"*".repeat(i+1)}ptr${i+1} = &ptr${i === 1 ? "" : i};`;
}

console.log(out);
