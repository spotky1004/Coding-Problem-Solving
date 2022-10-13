const isDev = process.platform !== "linux";
const [, ...nums] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`5
1
8
1000
2
33076161
`
)
  .trim()
  .split("\n")
  .map(BigInt);

let maxNum = 1e181;
let iterCount = BigInt(Math.ceil(Math.log2(maxNum)));

let out = "";
for (const num of nums) {
  const fixedNum = num * 10n**30n;
  
  let cur = 0n;
  let jump = 2n ** iterCount;
  while (true) {
    const curCube = cur ** 3n;
    const curAccCube = (cur + 1n) ** 3n;
    if (curCube <= fixedNum && fixedNum <= curAccCube) {
      break;
    }
    if (curCube > fixedNum) {
      cur -= jump;
    } else {
      cur += jump;
    }
    jump /= 2n;
  }

  out += cur.toString().replace(/(\d{10})$/, ".$1") + "\n";
}

console.log(out.trim());
