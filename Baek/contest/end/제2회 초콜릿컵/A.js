const isDev = process?.platform !== "linux";
const strs = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`8
XYYXXY
BANABAN
DOTTODOT
DADADADADA
RANDOM
HOTSHOT
CHOCOLATE
DADADADADADA`
)
  .trim()
  .split("\n")
  .slice(1);

const rev = (str) => Array.from(str).reverse().join("");

const out = [];
for (const str of strs) {
  const len = str.length;
  let isChoco = false;
  if (len % 3 === 0) {
    const [r1, r2, r3] = [0, len / 3, len / 3 * 2];
    const [a, b, c] = [
      str.slice(r1, r2),
      rev(str.slice(r2, r3)),
      str.slice(r3)
    ];
    if (a === b && b === c) isChoco = true;
  } else if ((len + 1) % 3 === 0) {
    {
      const [r1, r2, r3] = [0, (len + 1) / 3, (len + 1) / 3 * 2 - 1];
      const [a, b, c] = [
        str.slice(r1, r2),
        rev(str.slice(r2, r3)),
        str.slice(r3)
      ];
      if (a === c && a.startsWith(b)) isChoco = true;
    }
    {
      const [r1, r2, r3] = [0, (len + 1) / 3, (len + 1) / 3 * 2];
      const [a, b, c] = [
        str.slice(r1, r2),
        rev(str.slice(r2, r3)),
        str.slice(r3)
      ];
      if (a === b && a.endsWith(c)) isChoco = true;
    }
  } else if ((len + 2) % 3 === 0) {
    const [r1, r2, r3] = [0, (len + 2) / 3, (len + 2) / 3 * 2 - 1];
    const [a, b, c] = [
      str.slice(r1, r2),
      rev(str.slice(r2, r3)),
      str.slice(r3)
    ];
    if (a.startsWith(b) && a.endsWith(c)) isChoco = true;
  }
  out.push(+isChoco);
}
console.log(out.join("\n"));
