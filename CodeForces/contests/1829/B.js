const [, ...cases] =
(require('fs').readFileSync(0)+"")
// `5
// 5
// 1 0 0 1 0
// 4
// 0 1 1 1
// 1
// 0
// 3
// 1 1 1
// 9
// 1 0 0 0 1 0 0 0 1
// `
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];

let i = 0;
while (i < cases.length) {
  i++;
  const b = cases[i];
  i++;

  let max = 0;
  let cur = 0;
  for (let i = 0; i < b.length; i++) {
    cur++;
    if (b[i] === 1) cur = 0;
    max = Math.max(max, cur);
  }

  out.push(max);
}

console.log(out.join("\n"));
