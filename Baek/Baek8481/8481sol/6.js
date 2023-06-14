const facts = [1n];
for (let i = 1n; i < 26n; i++) facts.push(facts[Number(i) - 1] * i);
const factAcc = [1n];
for (let i = 1; i < 26; i++) factAcc.push(factAcc[i - 1] + facts[i]);

const alphas = "abcdefghijklmnopqrstuvwxyz";
const out = [];
for (let i = 1; i <= 20000; i++) {
  const idx = BigInt(i) ** 4n;
  const len = factAcc.findIndex(v => v > idx);
  const rIdx = idx - (factAcc[len - 1] ?? 0n);
  let str = "";
  const left = Array.from(alphas.slice(0, len));
  for (let j = len; j > 0; j--) {
    const m = facts[j];
    const f = facts[j - 1];
    str += left.splice(Number((rIdx % m) / f), 1)[0];
  }
  out.push(`T[${idx}]="${str}"`);
}
out[9999] = `T[10000000000000000]="9099099909999099999"`;
require("fs").writeFileSync("./out.txt", out.join("\n") + "\n");
