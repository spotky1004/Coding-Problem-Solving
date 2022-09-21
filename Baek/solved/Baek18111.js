let input = `3 4 0
1 2 3 4
5 6 7 8
9 10 11 12`.trim().split("\n").map(e => e.split(" ").map(Number));

const [mapX, mapY, inventory] = input[0];
input.shift();
input = input.flat();

let ground = new Array(257).fill(0);
let [low, top] = [Infinity, -Infinity];
for (let i = 0, l = input.length; i < l; i++) {
    const t = input[i];
    if (low > t) low = t;
    if (top < t) top = t;
    ground[t]++;
}

let fastestRecord = [Infinity, -Infinity];

for (let yTarget = low; yTarget <= top; yTarget++) {
    let dt = 0;
    let sessionInv = inventory;

    // break
    let toBreak = ground.reduce((a, b, i) => a+Math.max(0, i-yTarget)*b, 0);
    dt += toBreak*2;
    sessionInv += toBreak;

    // place
    let toPlace = ground.reduce((a, b, i) => a+Math.max(0, yTarget-i)*b, 0);
    dt += toPlace;
    sessionInv -= toPlace;
    if (sessionInv < 0) continue;

    if (dt <= fastestRecord[0] && yTarget > fastestRecord[1]) fastestRecord = [dt, yTarget];
}

console.log(fastestRecord.join(" "));