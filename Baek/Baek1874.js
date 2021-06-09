let input = `8
4
3
6
8
7
5
2
1`.trim().split("\n").map(Number);
let stackLength = input[0];
input.shift();


let stack = Array.from({length: stackLength}, (_, i) => i+1);
let arr = [];
const func = {
    push: () => {arr.push(stack.shift()); return "+"},
    pop : () => {stack.push(arr.pop()); return "-"}
}

let answer = ``;

for (let i = 0; i < stackLength; i++) {
    while (input[i] != arr.slice(-1)[0]) {
        if (stack.length == 0) {
            console.log("NO");
            process.exit(0);
        }
        answer += func.push()+"\n";
    }
    answer += func.pop()+"\n";
}
console.log(answer.trim());
