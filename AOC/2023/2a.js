const input = require("fs").readFileSync("./AOC/2023/2.in", "utf-8");
const lines = input.split("\n");

const colorIdx = {
  "red": 0,
  "green": 1,
  "blue": 2
};
const maxCube = [12, 13, 14];

let sum = 0;
loop: for (const line of lines) {
  const gameNum = +line.split(":")[0].split(" ")[1];
  const bags = line.split(":")[1].split(";").map(v => v.trim().split(", "));
  for (const bag of bags) {
    const cubes = [0, 0, 0];
    for (const [count, color] of bag.map(item => item.split(" "))) {
      cubes[colorIdx[color]] += Number(count);
    }
    if (maxCube.some((c, i) => c < cubes[i])) {
      continue loop;
    }
  }
  sum += gameNum;
}

console.log(sum);
