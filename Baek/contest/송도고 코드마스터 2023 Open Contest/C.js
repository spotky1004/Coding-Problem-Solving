const isDev = process?.platform !== "linux";
const [[n], ...students] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
1 1 1 0 0
0 1 0 1 1
1 0 1 0 1
0 1 1 0 1
0 1 1 0 1
1 0 0 1 0`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

let max = -1;
let maxStr = "";
for (let a = 0; a < 5; a++) {
  for (let b = 0; b < 5; b++) {
    if (a === b) continue;

    let cur = 0;
    for (let i = 0; i < n; i++) {
      const student = students[i];
      if (student[a] && student[b]) cur++;
    }
    if (max >= cur) continue;

    const curArr = [0, 0, 0, 0, 0];
    curArr[a] = 1;
    curArr[b] = 1;
    max = cur;
    maxStr = curArr.join(" ");
  }
}
console.log(max + "\n" + maxStr);
