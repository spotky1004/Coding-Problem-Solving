let input = `3 1
4 5 2`.split("\n").map(e => e.split(" ").map(Number));

const [N, M] = input.shift();
const numbers = input[0].sort((a,b) => a-b);
const length = numbers.length;

let allComb = [];

function findComb(depth, used=[], txt="") {
    for (let i = 0; i < length; i++) {
        if (used.includes(i)) continue;
        let tempUsed = used.slice(0);
        tempUsed.push(i);
        let tempTxt = txt + " " + numbers[i];
        if (depth+1 == M) allComb.push(tempTxt.trim());
        else findComb(depth+1, tempUsed, tempTxt)
    }
}
findComb(0);

console.log(allComb.join("\n"));