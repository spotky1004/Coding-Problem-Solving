let input = `1
9 21`.trim().split("\n");

// init
input.shift(); // dump dice count
const P = 1_000_000_007n; // prime

// make Fraction
input = input.map(e => e.split(" ").map(BigInt));
const den = input.reduce((a, b) => a*b[0], 1n);
const num = input.reduce((a, b) => a+b[1]*den/b[0], 0n);

// make pow table
let denPow = new Array(32);
denPow[0] = den%P;
for (let i = 1; i < 32; i++) {
    denPow[i] = (denPow[i-1]**2n)%P;
}

// "Fermat's little theorem"
const binP = (P-2n).toString(2).split("").reverse().join("");
let mul = 1n;
for (let i = 0, l = binP.length; i < l; i++) {
    if (binP[i] === "1") {
        mul = (mul * denPow[i])%P;
    }
}

console.log(Number((num*mul)%P));