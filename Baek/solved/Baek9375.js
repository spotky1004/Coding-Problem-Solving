const isDev = process?.platform !== "linux";
const [[T], ...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
3
hat headgear
sunglasses eyewear
turban headgear
3
mask face
sunglasses face
makeup face`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

let line = 0;
const out = [];
while (line < input.length) {
  const [n] = input[line].map(Number);
  line++;
  const cloths = input.slice(line, line + n);
  line += n;
  const gearEnum = new Map();
  const counter = [];
  for (let i = 0; i < n; i++) {
    const gear = cloths[i][1];
    if (!gearEnum.has(gear)) {
      gearEnum.set(gear, counter.length);
      counter.push(0);
    }
    counter[gearEnum.get(gear)]++;
  }

  const combCount = counter.reduce((a, b) => a * (b + 1), 1);
  out.push(combCount - 1);
}
console.log(out.join("\n"));
