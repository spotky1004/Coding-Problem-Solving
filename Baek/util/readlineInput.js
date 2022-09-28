const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lineLeft = null;

rl.on('line', function(line) {
  if (lineLeft === null) {
    lineLeft = +line;
    return;
  }
  if (lineLeft === 0) return;



  lineLeft--;
}).on("close", function() {
  process.exit();
});
