let input = `3 3`.split(" ").map(Number);

const [N, M] = input;

let allComb = [];

function findComb(depth, txt="", idx=0) {
    for (let i = idx, l = N; i < l; i++) {
        const tmpTxt = txt + " " + (i+1);
        if (depth+1 === M) allComb.push(tmpTxt.trim());
        else findComb(depth+1, tmpTxt, i);
    }
}
findComb(0);

console.log(allComb.join("\n"));