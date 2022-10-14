const isDev = process.platform !== "linux";
const [input, ...players] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`12 F
lms0806
powergee
skeep194
lms0806
tony9402
lms0806
wider93
lms0806
mageek2guanaah
lms0806
jthis
lms0806
`
)
  .trim()
  .split("\n")

const games = {
  "Y": 2,
  "F": 3,
  "O": 4
};
const playerCount = games[input.split(" ")[1]];
const sPlayers = new Set(players.flat())
const playCount = Math.floor(sPlayers.size / (playerCount - 1));
console.log(playCount);
