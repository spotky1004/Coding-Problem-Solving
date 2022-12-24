const isDev = process?.platform !== "linux";
const [[V, E, a], ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2 1 3
2 1 1 4
-3 7`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const [t1, t2] = datas.slice(-1);
let out = 1/3 * (t2**3 - t1**3);

// :thinking:
