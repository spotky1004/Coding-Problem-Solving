const isDev = process?.platform !== "linux";
const [[N, H, k], a] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 5 1
1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let count = 0;
const dp = Array.from({ length: N }, Array(H).fill(Infinity));
function search() {
  
}
