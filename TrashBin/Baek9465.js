let input = `1
6
20 5 30 9 19 0
30 9 10 0 30 14`.trim().split("\n").map(e => e.split(" ").map(Number));

let ans = [];
for (let i = 0, l = input.shift()[0]; i < l; i++) {
    const n = input.shift()[0];
    let stickers = input.splice(0, 2);
    stickers = stickers[0].map((_, i) => [stickers[0][i], stickers[1][i]]);
    let row = stickers[0][0] > stickers[0][1] ? 0 : 1;
    let score = 0;
    for (let j = 0; j < n; j++) {
        if (
            j+1 < n &&
            stickers[j][row] < stickers[j+1][row] &&
            stickers[j+1][row] > stickers[j+1][row^1] &&
            (
                j === 0 ||
                !(j+2 < n) ||
                stickers[j+1][row^1] + stickers[j+2][row] < stickers[j+1][row]
            )
        ) {
            if (j === 0) {
                console.log(i, j, stickers[j][row^1]);
                score += stickers[j][row^1];
            }
        } else {
            console.log(i, j, stickers[j][row]);
            score += stickers[j][row];
            row ^= 1;
        }
    }
    ans.push(score);
}
console.log(ans.join("\n"));