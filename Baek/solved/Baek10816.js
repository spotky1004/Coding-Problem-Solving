let input = `10
6 3 2 10 10 10 -10 -10 7 3
8
10 9 -5 2 3 4 5 -10`.trim().split("\n").map(Number);
let [a,b] = [
    input[3].split(" "),
    input[1].split(" ")
];

let cardCount = {};
for (let i = 0, l = b.length; i < l; i++) cardCount[b[i]] = cardCount[b[i]]+1||1;
let answer = [];
for (let i = 0, l = a.length; i < l; i++) answer.push(cardCount[a[i]]??0);
console.log(answer.join(" "));