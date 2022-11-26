const list = (require('fs').readFileSync(0)+"").trim().split("\n").slice(1).map(v => v.split(" "));

const dancing = new Set(["ChongChong"]);
for (const [a, b] of list) {
  const hasA = dancing.has(a);
  const hasB = dancing.has(b);
  if (hasA && !hasB) {
    dancing.add(b);
  } else if (hasB && !hasA) {
    dancing.add(a);
  }
}

console.log(dancing.size)
