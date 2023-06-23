const isDev = process?.platform !== "linux";
const [dimLengths, ...datas] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1 1 1 1 1 1 1 1 1 2 3
1 2 4
8 16 32
3
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 3
1 1 1 1 1 1 1 1 1 1 2 1 1 1 1 1 1 1 1 1 1 2
1 1 1 1 1 1 1 1 1 1 3 1 1 1 1 1 1 1 1 1 2 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const hyper = [];
const hyperProd = dimLengths.reduce((a, b) => a * b, 1);
const flatSeq = datas.slice(0, hyperProd / dimLengths[10]).flat();
function parseHyper(supDimArr, s = 0, e = hyperProd - 1, dim = 0, dimSize = hyperProd) {
  const dimLen = dimLengths[dim];
  const subDimSize = dimSize / dimLen;
  if (dim !== 10) {
    for (let i = 0; i < dimLen; i++) {
      const dimArr = [];
      supDimArr.push(dimArr);
      parseHyper(dimArr, i * subDimSize, (i + 1) * subDimSize - 1, dim + 1, subDimSize);
    }
  } else {
    for (let i = s; i <= e; i++) {
      supDimArr.push(flatSeq[i]);
    }
  }
}
parseHyper(hyper);
console.log(hyper);
