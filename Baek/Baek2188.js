let input = `5 5
2 1 2
1 1
2 2 3
3 3 4 5
1 1`.trim().split("\n").map(e => e.split(" ").map(Number));

const [N, M] = input.shift();

let searchingIdx = new Array(N).fill(-1);
let barnConnact = new Array(M).fill(-1);
let want = new Array(N).fill(0);
for (let i = 0; i < N; i++) {
    want[i] = input[i].slice(1).map(e => e-1);
}

let filled = 0;
function searchCow(n) {
    const nWant = want[n];

    for (let i = nWant.length-1; i >= 0; i--) {
        const nIdx = nWant[i];

        if (cleared[nIdx]) continue;
        cleared[nIdx] = true;

        if (barnConnact[nIdx] === -1 || searchCow(barnConnact[nIdx])) {
            barnConnact[nIdx] = n;
            searchingIdx[n] = i;
            return true;
        }
    }
    
    return false;
}

let cleared;
for (let i = 0; i < N; i++) {
    cleared = new Array(N).fill(false);
    filled += searchCow(i);
}

console.log(filled, barnConnact);