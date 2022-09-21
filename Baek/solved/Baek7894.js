let input = `2
1
1
1
20
10
10
10000000
1000000
100000`.trim().split("\n").map(Number);
input.shift();

let ans = new Array(input.length);
let sum = 0.00000000001;
for (let i = 1; i <= 1e7; i++) {
    sum += Math.log10(i);
    if (input.includes(i)) {
        let idxs = input.reduce(function(a, b, idx) {
            if (b === i) a.push(idx);
            return a;
        }, []);
        for (let n of idxs) ans[n] = Math.ceil(sum);
    }
}
console.log(ans.join("\n"));