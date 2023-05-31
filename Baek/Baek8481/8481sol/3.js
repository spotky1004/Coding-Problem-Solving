const out = Array.from({ length: 1024 }, (_, i) => Array(1024 - i).fill("."));
const paint = [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 2], [2, 0], [2, 1], [3, 0]];
const glyph = `.####..##..##.######..##...##..##.....####...####..###..####.
##..##.###.##...##...####..##.##.....##..##.##..##..##.##..##
##..##.##.###...##..##..##.####.........##..##..##..##.##..##
##..##.##..##...##..######.##.##......##....##..##..##.##..##
.####..##..##...##..##..##.##..##....######..####...##..####.`.split("\n");
function rec(x = 0, y = 0, size = 8) {
  if (size > 0) {
    const halfSize = 1 << (size + 1);
    rec(x, y, size - 1);
    rec(x, y + halfSize, size - 1);
    rec(x + halfSize, y, size - 1);
  } else {
    for (const [dx, dy] of paint) {
      out[y + dy][x + dx] = "#";
    }
  }
}
rec();
for (let y = 0; y < glyph.length; y++) {
  for (let x = 0; x < glyph[0].length; x++) {
    out[506 + y][449 + x] = glyph[y][x];
  }
}
require("fs").writeFileSync("./out.txt", out.map(v=>v.join("")).join("\n") + "\n");
