const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 2
..
..
2 4
...#
..##
4 2
..
..
..
..
`
)
  .trim()
  .split("\n")
  .map(line => {
    if (line.startsWith(".") || line.startsWith("#")) {
      return Array.from(line).map(v => v === "." ? true : false);
    } else {
      return line.split(" ").map(Number);
    }
  });

const grundy = [0, 0];
for (let i = 2; i <= 10; i++) {
  const vals = [];
  for (let j = 0; j <= i - 2; j++) {
    const left = j;
    const right = i - j - 2;
    vals.push(grundy[left] ^ grundy[right]);
  }
  for (let j = 0; j <= i - 1; j++) {
    const left = j;
    const right = i - j - 1;
    vals.push(grundy[left] ^ grundy[right] ^ 1);
  }

  let g = 0;
  while (true) {
    if (!vals.includes(g)) break;
    g++;
  }
  grundy[i] = g;
  console.log(i, vals, g);
}
console.log(grundy);

let i = 0;
let out = "";
while (i < input.length) {
  const [N, M] = input[i];
  i++;
  const board = input.slice(i, i + N);
  i += N;
  
  let ones = 0;
  /** @type {number[]} */
  let twoLens = [];

  for (let y = 0; y < N; y += 2) {
    const line1 = board[y];
    const line2 = board[y + 1] ?? [];
    let twoLen = 0;
    for (let x = 0; x < M; x++) {
      const a = line1[x];
      const b = line2[x];
      if (a && b) {
        twoLen++;
      } else {
        if (a || b) ones++;
        if (twoLen > 0) {
          twoLens.push(twoLen);
          twoLen = 0;
        }
      }
    }
    if (twoLen > 0) {
      twoLens.push(twoLen);
    }
  }

  let xorVal = grundy[twoLens[0]] ?? 0;
  for (let j = 1; j < twoLens.length; j++) {
    xorVal ^= grundy[twoLens[j]];
  }

  console.log(ones, twoLens, twoLens.map(v => grundy[v]), xorVal);

  const isFirstPlayerWon = (ones%2) ^ Math.sign(xorVal);
  out += isFirstPlayerWon ? "Y\n" : "M\n";
}

console.log(out.trim());
