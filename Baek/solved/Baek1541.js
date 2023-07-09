const isDev = process?.platform !== "linux";
const expr = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`00009-00009`
)
  .trim()

let out = 0;
let minusAppeared = false;
let tmpNum = 0;
let parseStack = [];
for (let i = 0; i < expr.length; i++) {
  const token = expr[i];
  if (token === "+") {
    tmpNum += parseInt(parseStack.join(""));
    parseStack = [];
  } else if (token === "-") {
    tmpNum += parseInt(parseStack.join(""));
    parseStack = [];

    if (!minusAppeared) out += tmpNum;
    else out -= tmpNum;
    tmpNum = 0;

    minusAppeared = true;
  } else {
    parseStack.push(token);
  }
}

tmpNum += parseInt(parseStack.join(""));
if (!minusAppeared) out += tmpNum;
else out -= tmpNum;

console.log(out);
