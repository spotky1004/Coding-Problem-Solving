let input = `3 3
0 0 2
0 0 0
0 0 0`.trim().split("\n").map(e => e.split(" ").map(Number));
// let t = new Date().getTime();

const [mapY, mapX] = input[0];
input.shift();
input = input.flat();
let loop = 0;

let maxSafe = 0;

function test(walls=[]) {
    let map = input.slice(0);

    for (let i = 0; i < 3; i++) {
        if (map[walls[i]] !== 0) return;
        map[walls[i]] = 1;
    }

    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            loop++;
            if (map[j] == 2) {
                if (map[j-mapX] === 0) map[j-mapX] = 2; // up
                if (map[j+mapX] === 0) map[j+mapX] = 2; // down
                if (j%mapX !== 0 && map[j-1] === 0) map[j-1] = 2; // left
                if (j%mapX !== mapX-1 && map[j+1] === 0) map[j+1] = 2; // right
            }
        }
    }

    const safeTile = map.filter(e => e === 0).length;
    if (maxSafe < safeTile) {
        /* debug
        let b = "";
        for (let i = 0; i < mapY; i++) b+=map.slice(i*mapX, (i+1)*mapX).toString()+"\n";
        console.log(b);
        */
        maxSafe = safeTile;
    }
}

let mapSize = mapX*mapY;

for (let a = 0; a < mapSize; a++)
    for (let b = a+1; b < mapSize; b++)
        for (let c = b+1; c < mapSize; c++)
        test([a, b, c]);

console.log(maxSafe);