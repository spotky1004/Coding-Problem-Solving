let [A, B, C] = `2 5 100`.split(" ").map(BigInt);

const bin = B.toString(2).split("").reverse().join("");
let binPow = new Array(bin.length+1);
binPow[0] = A;

for (let i = 1, l = binPow.length; i < l; i++) {
    binPow[i] = ((binPow[i-1])**2n)%C;
}

let mul = 1n;
for (let i = 0, l = bin.length; i < l; i++) {
    if (bin[i] === "1") {
        mul = (mul * binPow[i])%C;
    }
}

console.log(Number(mul));