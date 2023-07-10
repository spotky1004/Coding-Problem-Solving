const isDev = process?.platform !== "linux";
const [[N], [M], broken] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`103
5
2 3 5 7 8`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const notBrokens = Array.from({ length: 10 }, (_, i) => i)
  .filter(v => !(broken ?? []).includes(v))
  .map(v => v + "");
notBrokens.push("");

let minBtn = Math.abs(100 - N);
for (const a of notBrokens) {
  if (a === "") continue;
  for (const b of notBrokens) {
    for (const c of notBrokens) {
      for (const d of notBrokens) {
        for (const e of notBrokens) {
          for (const f of notBrokens) {
            const ch = a + b + c + d + e + f;
            minBtn = Math.min(minBtn, Math.abs(N - ch) + ch.length);
          }
        }
      }
    }
  }
}
console.log(minBtn);
