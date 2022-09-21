let input = `11 10
7 4 0
1 1 1 1 1 1 1 1 1 1
1 0 0 0 0 0 0 0 0 1
1 0 0 0 1 1 1 1 0 1
1 0 0 1 1 0 0 0 0 1
1 0 1 1 0 0 0 0 0 1
1 0 0 0 0 0 0 0 0 1
1 0 0 0 0 0 0 1 0 1
1 0 0 0 0 0 1 1 0 1
1 0 0 0 0 0 1 1 0 1
1 0 0 0 0 0 0 0 0 1
1 1 1 1 1 1 1 1 1 1`.trim().split("\n").map(e => e.split(" ").map(Number));

const [mapX, mapY] = input.shift();
let [y, x, d] = input.shift();

const direct = [
    {x: 0, y:-1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x:-1, y: 0}
];

let clean = 0;
for (;;) {
    clean += !input[y][x];
    input[y][x] = 2;

    const left = direct[(d+3)%4];
    let leftTile = input[y+left.y][x+left.x];
    
    if (leftTile === 0) {
        x += left.x;
        y += left.y;
        d = (d+3)%4;
        continue;
    }
    
    if (
        input[y+1][x] !== 0 &&
        input[y-1][x] !== 0 &&
        input[y][x+1] !== 0 &&
        input[y][x-1] !== 0
    ) {
        const back = direct[(d+2)%4];
        let backTile = input[y+back.y][x+back.x];
        if (backTile !== 1) {
            x += back.x;
            y += back.y;
        } else {
            break;
        }
    } else {
        d = (d+3)%4;
    }
}
console.log(clean);