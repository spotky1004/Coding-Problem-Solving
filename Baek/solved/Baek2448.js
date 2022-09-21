let input = 3*2**10;

let stars = new Array(input).fill(0).map(e => new Array(input*2-1).fill(" "));

function fillStar(x, y, level) {
    if (level == 0) {
        stars[y][x] = "*";

        stars[y+1][x-1] = "*";
        stars[y+1][x+1] = "*";

        stars[y+2][x-2] = "*";
        stars[y+2][x-1] = "*";
        stars[y+2][x]   = "*";
        stars[y+2][x+1] = "*";
        stars[y+2][x+2] = "*";
    } else {
        const dist = 3*2**(level-1);
        fillStar(x, y, level-1);
        fillStar(x-dist, y+dist, level-1);
        fillStar(x+dist, y+dist, level-1);
    }
}
fillStar(input-1, 0, Math.round(Math.log(input/3)/Math.log(2)));

console.log(stars.map(e => e.join("")).join("\n"));