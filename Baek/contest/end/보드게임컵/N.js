const isDev = process?.platform !== "linux";
const [[N], players] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1 2 3 4`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const playerCard = Array(1000001).fill(-1);
for (let i = 0; i < players.length; i++) {
  const x = players[i];
  playerCard[x] = i;
}

const scores = Array(players.length).fill(0);
for (let i = 0; i < playerCard.length; i++) {
  const playerIdx = playerCard[i];
  if (playerIdx === -1) continue;
  for (let j = i*2; j < playerCard.length; j += i) {
    const otherPlayerIdx = playerCard[j];
    if (otherPlayerIdx === -1) continue;
    scores[playerIdx]++;
    scores[otherPlayerIdx]--;
  }
}

console.log(scores.join(" "));
