let input = `4 2
9 7 9 1`.split("\n").map(e => e.split(" ").map(Number));

const [N, M] = input.shift();
const numbers = input[0].sort((a,b) => a-b);
const length = numbers.length;

let allComb = [];

function findComb(depth, txt="", used=[]) {
    for (let i = 0; i < length; i++) {
        if (used.includes(i)) continue;
        let tempUsed = used.slice(0);
        tempUsed.push(i);
        let tempTxt = txt + " " + numbers[i];
        if (depth+1 == M) allComb.push(tempTxt.trim());
        else findComb(depth+1, tempTxt, tempUsed);
    }
}
findComb(0);

console.log([...new Set(allComb)].join("\n"));