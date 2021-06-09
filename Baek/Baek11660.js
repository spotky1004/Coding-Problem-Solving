let input = `4 3
1 2 3 4
2 3 4 5
3 4 5 6
4 5 6 7
2 2 3 4
3 4 3 4
1 1 4 4`.split("\n").map(e => e.split(" ").map(Number));

let [N, M] = input.shift();
let table = input.splice(0, N);
let toSum = input.splice(0, M).map(e => e.map(e => e-1)).map(e => e = {
    y1: Math.min(e[0], e[2]),
    x1: Math.min(e[1], e[3]),
    y2: Math.max(e[0], e[2]),
    x2: Math.max(e[1], e[3])
});

let preSum = new Array(N).fill(0).map(e => new Array(N).fill(0));
for (let y = 0; y < N; y++) {
    let colSum = 0;
    for (let x = 0; x < N; x++) {
        colSum += table[y][x];
        preSum[y][x] = colSum;
    }
}

let answer = "";
for (let i = 0; i < M; i++) {
    const box = toSum[i];
    
    let sum = 0;
    for (let y = box.y1; y <= box.y2; y++) {
        sum += preSum[y][box.x2]-(box.x1>0?preSum[y][box.x1-1]:0);
    }
    answer += sum + "\n";
}
console.log(answer.trim());