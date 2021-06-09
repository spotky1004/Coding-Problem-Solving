let [A, X] = `2
18014398509481985`.trim().split("\n").map(BigInt);

A = BigInt(A);
let savedPow = new Array(64);
savedPow[0] = A;

const prime = 1_000_000_007n;

for (let i = 1; i < 64; i++) {
    savedPow[i] = savedPow[i-1]**2n;
    savedPow[i] %= prime;
}

const binX = X.toString(2).split("").reverse().join("");
let mul = 1n;
for (let i = 0, l = binX.length; i < l; i++) {
    if (binX[i] === "1") mul = (mul%prime * savedPow[i]%prime)%prime;
}
console.log(mul);