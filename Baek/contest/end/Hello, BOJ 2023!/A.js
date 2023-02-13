const isDev = process?.platform !== "linux";
const [[T], ...cases] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
1
9
2022
2023
1000000000`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/** @param {string[]} numbers */
function calcAvaiables(numbers) {
  const avaiables = new Set();
  for (let i = 0; i < 2**(numbers.length - 1); i++) {
    const bit = Array.from(i.toString(2).padStart(numbers.length, "0")).reverse().join("");
    const merged = [""];
    for (let j = 0; j < numbers.length; j++) {
      merged[merged.length - 1] += numbers[j];
      if (bit[j] === "1") {
        merged.push("");
      }
    }
    avaiables.add(merged.reduce((a, b) => a + +b, 0));
  }
  return avaiables;
}

for (const n of cases) {
  const splited = Array.from(n.toString());
  const avaiables = calcAvaiables(splited);

  if (
    splited.filter(v => v !== "1" && v !== "0").length === 0 &&
    avaiables.has(splited.filter(v => v === "1").length)
  ) {
    console.log("Hello, BOJ 2023!");
    continue;
  }

  let count = 0;
  for (let i = 1; i <= 40; i++) {
    const sum = splited.reduce((a, b) => a + b**i, 0);
    if (sum > n) continue;
    count += avaiables.has(sum) ? 1 : 0;
  }
  console.log(count);
}
