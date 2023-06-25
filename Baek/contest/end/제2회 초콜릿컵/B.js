const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
OOO
O-O
XOO
1 7
XOO
O-O
XXO
2 1 4
OXO
O-X
XXO
3 1 1 2
XOX
O-O
XOX
4 1 1 1 1
XOO
O-O
OOX
1 6
OXX
O-O
XXO
3 1 1 2`
)
  .trim()
  .split("\n");

const order = [
  [0, 0], [1, 0], [2, 0],
  [2, 1], [2, 2], [1, 2],
  [0, 2], [0, 1]
];

const out = [];
let line = 1;
while (line < input.length) {
  const board = [];
  for (let i = 0; i < 3; i++) {
    board.push(Array.from(input[line]));
    line++;
  }
  const cells = [];
  for (const [x, y] of order) {
    const cell = board[y][x];
    if (cell === "O") cells.push(1);
    else cells.push(0);
  }
  const nums = input[line].split(" ").map(Number).slice(1);
  line++;
  let t = 0;
  while (cells[0] === 1 && cells[7] === 1 && t < 8) {
    cells.unshift(cells.pop());
    t++;
  }
  
  const counts = [];
  let count = 0;
  for (let i = 0; i < cells.length + 1; i++) {
    if (cells[i] !== 1) {
      if (count !== 0) counts.push(count);
      count = 0;
    } else {
      count++;
    }
  }
  counts.sort((a, b) => a - b);
  out.push((nums+"") === (counts+"") ? 1 : 0)
}
console.log(out.join("\n"));
