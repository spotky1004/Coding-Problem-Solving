/** @type {string[]} */
const input = require("fs").readFileSync("/dev/stdin").toString().trim().split("\n");

const [pokeCount, questionCount] = input.shift().split(" ").map(Number);
const pokeList = input.splice(0, pokeCount);
const pokeMap = new Map(pokeList.map((name, i) => [name, i+1]));

const answer = input.splice(0, questionCount).map(question => {
  const nr = parseInt(question);
  if (isNaN(nr)) {
    return pokeMap.get(question);
  } else {
    return pokeList[nr - 1];
  }
});
console.log(answer.join("\n"));
