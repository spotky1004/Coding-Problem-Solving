const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`20 21
`
)
  .trim()
  .split("\n").map(line => line.split(" ").map(Number));

/** @type {[number, number]} */
const [N, k] = input.shift();
let digit = 0;
let left = k;
let n = -1;
while (true) {
  digit++;
  const avaiables = digit * 9*10**(digit - 1);
  if (left > avaiables) {
    left -= avaiables;
  } else {
    n = (10**(digit - 1) - 1) + Math.ceil(left/digit);
    break;
  }
}

if (n <= N) {
  const pos = (left%digit === 0 ? digit : left%digit) - 1;
  console.log((n+"")[pos]);
} else {
  console.log(-1);
}
