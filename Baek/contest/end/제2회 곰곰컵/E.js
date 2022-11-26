const m = 1_00000_00000_00000_00000n;

const [[N, L], x, w] = `6 100
0 59 32 100 7 32
1993 21 42 1 12 19`.split("\n").map(v => v.split(" ").map(w => BigInt(w)));

const sumA = x.reduce((a, xi, i) => a + xi*w[i]*m, 0n);
const sumB = w.reduce((a, wi) => a + wi, 0n);

console.log(Number(sumA/sumB)/Number(m));
