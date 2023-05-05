const [, ...cases] =
// (require('fs').readFileSync(0)+"")
`4
5
5 1 4 2 3
4
1 1 1 1
6
9 8 7 6 5 4
7
100000000 1 100000000 1 100000000 1 100000000
`
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const out = [];

let t = 0;
while (t < cases.length) {
  t++;
  const s = cases[t];
  t++;

  let max = 0;
  let maxSights = [];
  for (let i = 0; i < s.length; i++) {
    maxSights.push(i);
    const sortedDist = [...maxSights].sort((a, b) => a - b);
    const benefit = sortedDist[1] - sortedDist[0];
    maxSights.sort((a, b) => Math.max(0, s[b] - (b === sortedDist[0] ? benefit : 0)) - Math.max(0, s[a] - (a === sortedDist[0] ? benefit : 0)));
    maxSights = maxSights.slice(0, 3);

    max = Math.max(max, maxSights.reduce((a, b) => a + s[b], 0) - Math.max(...maxSights) - Math.min(...maxSights));
  }

  out.push(max);
}

console.log(out.join("\n"));
