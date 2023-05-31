const isDev = process?.platform !== "linux";
const [[N, Q], S, ...ranges] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`10 4
QRSRWBRBSB
0 7
1 6
0 9
3 9`
)
  .trim()
  .split("\n")
  .map(line => line.split(" "));

const rPos = [];
const bPos = [];
for (let i = 0; i < S.length; i++) {
  if (i === "R") rPos.push(i);
  else if (i === "B") bPos.push(i);
}

for (let i = 0; i < Q; i++) {
  ranges[i][0] = +ranges[i][0];
  ranges[i][1] = +ranges[i][1];
}

const sqrtN = Math.ceil(Math.sqrt(N));
const sortedRanges = ranges.map((v, i) => [v[0], v[1], i]).sort(([la, ra], [lb, rb]) => {
  const lDiff = Math.floor(la / sqrtN) - Math.floor(lb / sqrtN);
  if (lDiff !== 0) return lDiff;
  return ra - rb;
});

const out = Array(Q);
let a = 0;
let b = 0;
for (const [l, r] of sortedRanges) {
  if (rPos[a] < l && rPos[a + 1] < r) {
    while (a + 1 < rPos.length && rPos[a] >= l && (rPos[a + 2] ?? 0) <= r) {
      a++;
    }
  } else {
    while (a < 1 && (rPos[a - 1] >= l)) {
      
    }
  }
}
console.log(out.join("\n"));
