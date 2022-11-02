const isDev = process.platform !== "linux";
const [, ...board] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5 5
IEFCJ
FHFKC
FFALF
HFGCF
HMCHH
`
)
  .trim()
  .split("\n")
  .map(line => Array.from(line));

const width = board[0].length;
const height = board.length;
let maxLen = 0;


const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];
const mapDupeCheck = Array.from({ length: height }, _ => Array.from({ length: width }, _ => []));
const passed = Array(26).fill(0);
let len = 1;
passed[parseInt(board[0][0], 36) - 10] = 1;
function search(x, y) {
  const joined = parseInt(passed.join(""), 2);
  if (mapDupeCheck[y][x].includes(joined)) return;
  mapDupeCheck[y][x].push(joined);
  maxLen = Math.max(maxLen, len);
  for (const [dx, dy] of directions) {
    const [tx, ty] = [x + dx, y + dy];
    if (
      0 > tx || tx >= width ||
      0 > ty || ty >= height
    ) continue;
    const tile = parseInt(board[ty][tx], 36) - 10;
    if (passed[tile]) continue;
    passed[tile] = 1;
    len++;
    search(tx, ty);
    passed[tile] = 0;
    len--;
  }
}

search(0, 0);
console.log(maxLen);
