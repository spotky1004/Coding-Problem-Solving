const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`mirkovC4nizCC44
C4 
`
)
  .trim()
  .split("\n");

const str = input.shift().split("").reverse();
const stack = [];
let sameLen = 0;
const bomb = input.shift();
const bombLen = bomb.length;

while (str.length > 0) {
  const char = str.pop();
  if (char === bomb[sameLen]) {
    sameLen++;
  } else {
    sameLen = 0;
    if (char === bomb[0]) {
      sameLen = 1;
    }
  }
  if (sameLen === bombLen) {
    for (let i = 0; i < bombLen - 1; i++) {
      if (stack.length > 0) {
        stack.pop();
      }
    }
    for (let i = 0; i < bombLen - 1; i++) {
      if (stack.length > 0) {
        str.push(stack.pop());
      }
    }
    sameLen = 0;
  } else {
    stack.push(char);
  }
}

const output = stack.join("");
console.log(output === "" ? "FRULA" : output);
