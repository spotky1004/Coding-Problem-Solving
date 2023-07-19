const isDev = process?.platform !== "linux";
const [[T], ...cases] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`4
1 1 1 1 1 0 0 0 0 0
0 0 0 0 0 1 1 1 1 1
0 1 0 1 0 1 0 1 0 1
1 0 0 0 0 0 0 0 0 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const monthDays = [
  0,
  31, 29, 31, 30,
  31, 30, 31, 31,
  30, 31, 30, 31
];

const out = [];
for (const banned of cases) {
  const avaiableDays = Array(32);
  avaiableDays[0] = 0;
  loop: for (let i = 1; i < 32; i++) {
    const s = i.toString();
    for (let j = 0; j < 10; j++) {
      if (banned[j] === 0) continue;
      avaiableDays[i] = avaiableDays[i - 1];
      if (s.includes(j)) continue loop;
    }
    avaiableDays[i] = avaiableDays[i - 1] + 1;
  }

  let count = 0;
  loop: for (let i = 1; i <= 12; i++) {
    const s = i.toString();
    for (let j = 0; j < 10; j++) {
      if (banned[j] === 0) continue;
      if (s.includes(j)) continue loop;
    }
    count += avaiableDays[monthDays[i]];
  }
  out.push(count);
}
console.log(out.join("\n"));
