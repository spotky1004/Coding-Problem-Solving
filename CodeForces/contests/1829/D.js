const [, ...cases] =
(require('fs').readFileSync(0)+"")
// `11
// 6 4
// 9 4
// 4 2
// 18 27
// 27 4
// 27 2
// 27 10
// 1 1
// 3 1
// 5 1
// 746001 2984004
// `
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];
for (const [n, m] of cases) {
  let piles = n % 3 ? [] : [n];
  let isPossible = n === m;

  while (piles.length > 0) {
    const newPiles = [];
    for (const p of piles) {
      if (p % 3) continue;
      const p1 = p / 3;
      const p2 = p1 * 2;
      if (!newPiles.includes(p1)) newPiles.push(p1);
      if (!newPiles.includes(p2)) newPiles.push(p2);
    }
    
    if (newPiles.includes(m)) {
      isPossible = true;
      break;
    }
    piles = newPiles;
  }

  out.push(isPossible ? "YES" : "NO");
}

console.log(out.join("\n"));
