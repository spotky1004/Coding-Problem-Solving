const [n, m] = "100 6".split(" ").map(Number);

let ans = 1n;
for (let i = 1; i <= n; i++) ans *= BigInt(i);
for (let i = 1; i <= m; i++) ans /= BigInt(i);
for (let i = 1; i <= n-m; i++) ans /= BigInt(i);

console.log(ans+"");