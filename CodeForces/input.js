const [, ...cases] =
// (require('fs').readFileSync(0)+"")
``
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];

let i = 0;
while (i < cases.length) {
  const n = cases[i][0];
  i++;

  out.push();
}

console.log(out.join("\n"));
