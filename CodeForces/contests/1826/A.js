const input = (require('fs').readFileSync(0)+"")
  .trim()
  .split("\n")
  .slice(1)
  .map(line => line.split(" ").map(Number));

const out = [];

let i = 0;
while (i < input.length) {
  const n = input[i][0];
  i++;
  const l = input[i];
  i++;

  const lSum = l.reduce((acc, cur) => {
    acc[cur]++;
    return acc;
  }, Array(n + 1).fill(0));

  const liairAcc = Array(n + 1).fill(0);
  for (let i = 0; i < n + 1; i++) {
    const toAdd = lSum[i];
    for (let j = 0; j < n + 1; j++) {
      if (i <= j) continue;
      liairAcc[j] += toAdd;
    }
  }

  out.push(liairAcc.findIndex((v, i) => v === i));
}

console.log(out.join("\n"));
