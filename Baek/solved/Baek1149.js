let input = `3
26 40 83
49 60 57
13 89 99`.trim().split("\n").map(e => e.split(" ").map(Number));

let houses  = input.shift()[0];
for (let i = 1; i < houses; i++) {
    input[i][0] += Math.min(input[i-1][1], input[i-1][2]);
    input[i][1] += Math.min(input[i-1][0], input[i-1][2]);
    input[i][2] += Math.min(input[i-1][0], input[i-1][1]);
}

console.log(Math.min(...input.pop()));