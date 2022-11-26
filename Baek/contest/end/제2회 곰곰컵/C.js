const [gomCounts, ticketCounts] = (require('fs').readFileSync(0)+"").split("\n").map(v => v.split(" ").map(Number));

let fullGomDoRi = 0;
for (let i = 0; i < 3; i++) {
  const [a, b] = [gomCounts[i], ticketCounts[i]];
  fullGomDoRi += Math.min(a, b);
  ticketCounts[i] = Math.max(0, ticketCounts[i] - a);
  gomCounts[i] = Math.max(0, gomCounts[i] - b);
}
for (let i = 0; i < 3; i++) {
  const ticketIdx = (i+5)%3;
  const [a, b] = [gomCounts[i], ticketCounts[ticketIdx]];
  const gomAte = Math.min(a, Math.floor(b/3));
  fullGomDoRi += gomAte;
  ticketCounts[ticketIdx] = Math.max(0, ticketCounts[ticketIdx] - gomAte*3);
  gomCounts[i] = Math.max(0, gomCounts[i] - gomAte);
}
for (let i = 0; i < 3; i++) {
  const ticketIdx = (i+4)%3;
  const [a, b] = [gomCounts[i], ticketCounts[ticketIdx]];
  const gomAte = Math.min(a, Math.floor(b/9));
  fullGomDoRi += gomAte;
  ticketCounts[ticketIdx] = Math.max(0, ticketCounts[ticketIdx] - gomAte*9);
  gomCounts[i] = Math.max(0, gomCounts[i] - gomAte);
}

console.log(fullGomDoRi);
