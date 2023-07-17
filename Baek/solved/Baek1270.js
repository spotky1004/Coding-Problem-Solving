const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const out = [];
let lineNr = -1;
rl.on('line', function(line) {
  lineNr++;
  if (lineNr === 0) return;

  const c = line.split(" ");
  
  const Ti = c.shift();

  let count = 0;
  let major = -1;

  for (const num of c) {
    if (count === 0) major = num;
    if (major === num) count++;
    else count--;
  }

  if (
    Ti !== 0 &&
    c.reduce((a, b) => a + (b === major), 0) > Ti / 2
  ) {
    out.push(major);
  } else {
    out.push("SYJKGW");
  }
}).on("close", function() {
  console.log(out.join("\n"));
  process.exit();
});
