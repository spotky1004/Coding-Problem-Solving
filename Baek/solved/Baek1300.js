const isDev = process.platform !== "linux";
const [[N], [k]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`100
1
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

function calcOrder(x) {
  let acc = 0;
  let maxInt = 0;
  let maxIntCount = 0;
  for (let i = 0; i < N; i++) {
    const cur = Math.min(N, Math.floor(x / (i + 1)));
    acc += cur;

    let int = cur * (i + 1);
    if (maxInt < int) {
      maxInt = int;
      maxIntCount = 1;
    } else if (maxInt === int) {
      maxIntCount++;
    }
  }
  return acc - (maxIntCount - 1);
}
function solve(k) {
  let left = 1;
  let right = N**2;
  let cur = Math.floor((left + right) / 2);
  while (left < right) {
    cur = Math.floor((left + right) / 2);
    const acc = calcOrder(cur);
    if (acc > k) {
      right = --cur;
    } else if (acc === k) {
      break;
    } else {
      left = ++cur;
    }
  }
  
  while (true) {
    const a = calcOrder(cur);
    const b = calcOrder(cur - 1);
    if (a === b || k < a) {
      cur--;
    } else {
      break;
    }
  }

  return cur;
}

console.log(solve(k));
