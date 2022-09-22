const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lineLeft = null;
let prevMinScore = [0, 0, 0];
let prevMaxScore = [0, 0, 0];

rl.on('line', function(line) {
  if (lineLeft === null) {
    lineLeft = +line;
    return;
  }
  if (lineLeft === 0) return;

  const scores = line.split(" ").map(Number);

  const [pa1, pa2, pa3] = prevMinScore;
  const [pb1, pb2, pb3] = prevMaxScore;

  const curMinScore = scores.slice();
  const curMaxScore = scores.slice();
  curMinScore[0] += Math.min(pa1, pa2);
  curMinScore[1] += Math.min(pa1, pa2, pa3);
  curMinScore[2] += Math.min(pa2, pa3);
  prevMinScore = curMinScore;
  curMaxScore[0] += Math.max(pb1, pb2);
  curMaxScore[1] += Math.max(pb1, pb2, pb3);
  curMaxScore[2] += Math.max(pb2, pb3);
  prevMaxScore = curMaxScore;

  lineLeft--;
}).on("close", function() {
  console.log(Math.max(...prevMaxScore), Math.min(...prevMinScore));
  process.exit();
});
