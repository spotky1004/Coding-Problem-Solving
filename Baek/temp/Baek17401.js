const isDev = process.platform !== "linux";
const [[T, N, D], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1 2 4
2
1 1 2
2 2 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/** @type {[from: number, to: number, tunnel: number][][]} */
const maps = [];
(() => {
  let i = 0;
  while (i < datas.length) {
    const mi = datas[i];
    i++;
    const map = [];
    maps.push(map);
    for (let j = 0; j < mi; j++) {
      map.push(datas[i + j].map(v => v - 1));
    }
    i += mi;
  }
})();

const counts = Array.from({ length: N }, (_, i) => {
  const arr = Array(N).fill(0);
  arr[i] = 1;
  return arr;
});
for (let d = 0; d < D; d++) {
  const map = maps[d%i];
}
