let input = `5
2 7 2
1 4 5
3 8 10
3 4 10
36739 49019 43234823094829`.trim().split("\n").map(e => e.split(" ").map(Number));

let gcd = (a, b) => !b ? a : gcd(b, a%b);

let output = "";
for (let i = 0, l = input.shift()[0]; i < l; i++) {
    const [p,q,n] = input.shift();
    let loopShift = (p*Math.ceil(q/p))%q;
    if (loopShift+p > q) loopShift = p-loopShift;
    const loopPer = q/gcd(p, loopShift);
    const loopSum = Math.max(1, loopShift)*(loopPer*(loopPer-1)/2);
    const loop = Math.floor(n/loopPer);
    
    let lastSum = 0;
    for (let j = 0, l2 = n-loop*loopPer; j < l2; j++) {
        lastSum += p*(j+1)%q;
    }

    //console.log(`sub: ${lastSum-debug}`, [p, q, n], [loopShift, loopPer, loopSum, loop]);
    output += (loop*loopSum + lastSum) + "\n";
}

console.log(output.trim());