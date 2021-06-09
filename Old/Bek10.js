"use strict";

const rawMap = `3 3
%@*
***
***`;

let map = rawMap.split("\n");
let mapSize = map[0].split(" ");
mapSize = {x: +mapSize[0], y: +mapSize[1]};
map.shift();
map.forEach((e, i) => map[i] = e.split(""));

let movingPath = [];

for (let y = 0; y < mapSize.y; y++)
for (let x = 0; x < mapSize.x; x++)
if (map[y][x] === "@") movingPath.push({x: x, y: y})

const _directions = [
    {x:  1, y:  0},
    {x: -1, y:  0},
    {x:  0, y:  1},
    {x:  0, y: -1}
];

while (movingPath.toString()) {
    let tempMPath = [];
    for (let i = movingPath.length-1; i >= 0; i--) {
        const p = movingPath[i];
        for (const d of _directions) {
            const dp = {x: p.x+d.x, y: p.y+d.y};
            if (!Object.values(dp).every(e => e >= 0)) continue;
            const tile = (map[dp.y] ?? new Array(mapSize.x+1))[dp.x];
            if (tile === "#") {
                map[dp.y][dp.x] = "@";
                tempMPath.push(dp);
            } else if (tile === "%") {
                console.log("SURVIVE");
                process.exit(1);
            }
        }
        movingPath.splice(i, 1);
    }
    movingPath = movingPath.concat(tempMPath);
}
console.log("DIE");

//console.log(map);