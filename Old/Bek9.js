let Pillow = `1 2
*****%
**####
**#***
**#***
******
@#####`;

const rawMap = Pillow;
const mapSize = {x: 6, y: 6};
const map = rawMap.split("\n");
let [_tile, v] = map[0].split(" ");
_tile = Number(_tile); v = Number(v);
map.shift();
map.forEach((e, i) => map[i] = e.split(""));

let totalPillows = 2;
let runningPillows = [
    {toGo: 0, tile: _tile, x: 0, y: mapSize.y-1, nr: 0, cache: ""},
    {toGo: 1, tile: _tile, x: 0, y: mapSize.y-1, nr: 1, cache: ""}
];
let tileUsed = [];

while (runningPillows.toString()) {
    for (let i = runningPillows.length-1; i >= 0; i--) {
        let p = runningPillows[i];
    
        p.toGo ? p.x++ : p.y--; // move
        p.cache += p.toGo;
        
        try {
            if (map[p.y][p.x] === "*") p.tile--; // check floor is _gu dung E_
        } catch (e) { /* This Pillow will removed */ } // Zzz...
        
        if (p.x >= mapSize.x || p.y < 0 || p.y >= mapSize.y || p.tile < 0 || _tile-p.tile > v/2) {
            //if (p.tile < 0) console.log(`Pillow #${p.nr} dead by Kimdle...`);
            runningPillows.splice(i, 1);
            continue;
        } // check pillow dead by Kimdle
        
        if (map[p.y] && map[p.y][p.x] === "%") tileUsed.push(p.tile) // you survived!
        else {
            for (const j of [0, 1]) {
                runningPillows.push({...p, toGo: j, nr: totalPillows});
                totalPillows++;
            } // make next generation of pillow
        }
        runningPillows.splice(i, 1); // not dead, but goodbye
    }
}

let minTile = _tile - Math.max(...tileUsed);
if (!isFinite(minTile)) minTile = "DIE";

console.log(minTile);