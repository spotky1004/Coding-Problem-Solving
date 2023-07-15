const isDev = process?.platform !== "linux";
const [[N], ...items] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 2 P
6 1 B
4 4 P`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "))
  .map(v => [+v[0], +v[1], v[2]]);

let sumG = 0;
for (const [x, y, type] of items) {
  let g;
  if (type === "R") {
    g = x ^ y;
  } else if (type === "B") {
    g = Math.min(x, y);
  } else if (type === "K") {
    if (y % 2) {
      if (x % 2) g = 2;
      else if (x < y) g = 1;
      else g = 3;
    } else {
      if (x % 2 === 0) g = 0;
      else if (x < y) g = 3;
      else g = 1;
    }
  } else if (type === "N") {
    if (3 * Math.floor((y - 1) / 3) >= x) g = x % 3;
    else if (3 * Math.floor((x - 1) / 3) >= y) g = y % 3;
    else Number(x === 1 || x !== y);
  } else if (type === "P") {
    g = 3 * (Math.floor(x / 3) ^ Math.floor(y / 3)) + (((x % 3) + (y % 3)) % 3);
  }
  sumG ^= g;
}
console.log(sumG !== 0 ? "koosaga" : "cubelover");
