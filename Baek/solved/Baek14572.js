const isDev = process?.platform !== "linux";
const [[N, K, D], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4 5 10
3 10
1 2 3
3 20
2 3 4
3 30
3 4 5
3 40
1 3 5`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const students = [];
for (let i = 0; i < N; i++) {
  students.push([
    datas[i * 2][1],
    datas[i * 2 + 1].map(v => v - 1)
  ]);
}
students.sort((a, b) => a[0] - b[0]);

const algo = Array(K).fill(0);
let max = 0;
let i = 0;
let j = -1;
while (true) {
  j++;
  if (j >= students.length) break;
  const [rd, ra] = students[j];
  for (const a of ra) {
    algo[a]++;
  }

  while (rd - students[i][0] > D) {
    const [, la] = students[i];
    for (const a of la) {
      algo[a]--;
    }
    i++;
  }

  const studentCount = j - i + 1;
  let algoCount = 0;
  let algoAllKnowCount = 0;
  for (const a of algo) {
    if (a > 0) algoCount++;
    if (a === studentCount) algoAllKnowCount++;
  }

  const E = (algoCount - algoAllKnowCount) * studentCount;
  max = Math.max(max, E);
}
console.log(max);
