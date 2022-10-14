const isDev = process.platform !== "linux";
const [, potions] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
20 20 20 20 20
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let defVal = 0;
let out = "";
for (const potion of potions) {
  defVal = 1 - (1 - defVal) * (1 - potion/100);
  out += defVal*100 + "\n";
}

console.log(out.trim());
