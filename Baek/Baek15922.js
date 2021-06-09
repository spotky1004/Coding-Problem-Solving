let lines = (require('fs').readFileSync('/dev/stdin')+"").trim().split("\n").map(e => e.split(" ").map(Number));
lines.shift();
lines.sort((a, b) => a[0]-b[0]);

let l1 = lines[0];
for (let i = 1, l = lines.length; i < l; i++) {
    let l2 = lines[i];
    if (l2[0] <= l1[1]) {
        if (l1[1] < l2[1]) l1[1] = l2[1];
        lines[i] = false;
    } else {
        l1 = lines[i];
    }
}

console.log(lines.reduce((a, b) => a+(b != false ? (b[1]-b[0]) : 0), 0));