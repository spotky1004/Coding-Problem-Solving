const isDev = process.platform !== "linux";
let [[W], ...arr] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`R 3
1 2 3
4 5 6
7 8 9
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));


const reversed = [
  "?", "1", "5", "?", "?",
  "2", "?", "?", "8", "?"
];
arr = arr.map(line => line.map(v => reversed[v]));

if (W === "R" || W === "L") {
  arr.map(v => v.reverse());
} else {
  arr.reverse();
}

console.log(arr.map(line => line.join(" ")).join("\n"));

