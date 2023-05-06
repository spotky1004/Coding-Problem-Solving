const [, ...cases] =
// (require('fs').readFileSync(0)+"")
`5
coolforsez
cadafurcie
codeforces
paiuforces
forcescode
`
  .trim()
  .split("\n")
  .map(v => v.trim());

const out = [];
const orig = "codeforces";
for (const s of cases) {
  let diff = 0;
  for (let i = 0; i < orig.length; i++) {
    if (orig[i] !== s[i]) diff++;
  }

  out.push(diff);
}

console.log(out.join("\n"));
