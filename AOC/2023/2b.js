const input = require("fs").readFileSync("./AOC/2023/2.in", "utf-8");
const lines = input.split("\n");

const colorIdx = {
  "red": 0,
  "green": 1,
  "blue": 2
};

let sum = 0;
for (const line of lines) {
  const gameNum = +line.split(":")[0].split(" ")[1];
  const bags = line.split(":")[1].split(";").map(v => v.trim().split(", "));
  const maxCubes = [0, 0, 0];
  for (const bag of bags) {
    for (const [count, color] of bag.map(item => item.split(" "))) {
      maxCubes[colorIdx[color]] = Math.max(maxCubes[colorIdx[color]], Number(count));
    }
  }
  sum += maxCubes.reduce((a, b) => a * b, 1);
}

console.log(sum);
