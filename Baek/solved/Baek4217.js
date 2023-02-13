const isDev = process?.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
``
)
  .trim()
  .split("\n");

const directions = [
  [1, 0], [-1, 0],
  [0, 1], [0, -1]
];

/**
 * @param {number[][]} field 
 * @param {number} newId
 * @param {[sx: number, sy: number]} param1 
 */
function fillShape(field, newId, [sx, sy]) {
  const idToFill = field[sy][sx];

  const fillQueue = [[sx, sy]];
  while (fillQueue.length > 0) {
    const [x, y] = fillQueue.pop();
    if (field[y][x] !== idToFill) continue;
    field[y][x] = newId;
    for (const [dx, dy] of directions) {
      const coord = [x + dx, y + dy];
      if (
        typeof field[coord[1]] === "undefined" ||
        field[coord[1]][coord[0]] !== idToFill
      ) continue;
      fillQueue.push(coord);
    }
  }
}

let caseCount = 0;
let i = 0;
const glyphHoleCounts = ["W", "A", "K", "J", "S", "D"];
while (i < input.length) {
  caseCount++;

  let [H, W] = input[i].split(" ").map(v => Number(v));
  i++;
  if (H === 0 && W === 0) break;

  const rawField = input.slice(i, i + H).map(v => "0" + v + "0");
  i += H;

  W += 2;
  rawField.unshift("0".repeat(W));
  rawField.push("0".repeat(W));
  H += 2;
  
  const field = rawField.map(line => Array.from(line).map(c => Array.from(parseInt(c, 16).toString(2).padStart(4, "0"))).flat().map(Number));
  
  const holeCounts = [0, 0];
  for (let y = 0; y < H; y++) {
    const line = field[y];
    let prevId = 0;
    for (let x = 0; x < W * 4; x++) {
      const id = line[x];
      if (id >= 2) {
        prevId = id;
        continue;
      }
      
      const newId = holeCounts.length;
      fillShape(field, newId, [x, y]);
      holeCounts[prevId]++;
      if (prevId === 2) {
        holeCounts.push(0);
      } else {
        holeCounts.push(-1);
      }
      
      prevId = newId;
    }
  }

  const glyphs = [];
  for (const holeCount of holeCounts.slice(3)) {
    const glyph = glyphHoleCounts[holeCount];
    if (typeof glyph !== "undefined") {
      glyphs.push(glyph);
    }
  }

  // console.log(field.map(v => v.map(c => c.toString(36)).join("")).join("\n"));
  // console.log(holeCounts);
  console.log(`Case ${caseCount}: ${glyphs.sort().join("")}`);
}
