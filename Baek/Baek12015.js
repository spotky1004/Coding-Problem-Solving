const input = `10
10 20 10 30 20 50 70 21 22 21 90`.trim().split("\n").map(e => e.split(" ").map(Number));

let leng = input[0][0]+1;
let set  = input[1]; set.unshift(0);
let LLIS = new Array(leng+1).fill(Infinity); LLIS[0] = 0;
let LLISmax = 0;

for (let i = 1; i <= leng; i++) {
    for (let j = LLISmax+1; j >= 0; j--) {
        if (LLIS[j+1] <= set[i]) break;
        if (LLIS[j] < set[i]) {
            if (LLIS[j+1] > set[i]) LLIS[j+1] = set[i];
            if (LLISmax == j) LLISmax++;
            break;
        }
    }
}

console.log(LLISmax);