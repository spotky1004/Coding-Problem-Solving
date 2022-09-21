let input = `4 4
1231 1232 1233 1234`.split("\n").map(e => e.split(" ").map(Number));

const [N, M] = input.shift();
const numbers = input[0].sort((a,b) => a-b);
const length = numbers.length;

let allComb = [];

function findComb(depth, txt="", idx=0) {
    for (let i = idx; i < length; i++) {
        let tempTxt = txt + " " + numbers[i];
        if (depth+1 == M) allComb.push(tempTxt.trim());
        else findComb(depth+1, tempTxt, i);
    }
}
findComb(0);

console.log(allComb.join("\n"));