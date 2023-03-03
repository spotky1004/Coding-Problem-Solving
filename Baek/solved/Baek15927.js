const isDev = process?.platform !== "linux";
const [[str]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`A`.repeat(50_0000)
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

let maxLen = -1;
const check = (i, j) => {
  const len = j - i + 1;
  const halfLen = Math.floor(len / 2);
  return str.slice(i, i + halfLen) !== str.slice(j - halfLen + 1, j + 1).split("").reverse().join("");
};

let firstChar = str[0];
let isAllSame = true;
for (let i = 0; i < str.length; i++) {
  if (firstChar !== str[i]) {
    isAllSame = false;
    break;
  }
}
if (!isAllSame) {
  for (let i = 0; i < str.length; i++) {
    if (check(i, str.length - 1)) {
      maxLen = Math.max(maxLen, str.length - i);
      break;
    }
  }
}

console.log(maxLen);
