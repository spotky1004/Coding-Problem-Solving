const isDev = process.platform !== "linux";
const m = 100000000000000000000000000000000000000000000000000n;
const [, ...questions] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`3
1.5 -5 2 -1.5
2 -7 7 -2
2 0 0 0
`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(t => {
    let out = BigInt(parseInt(t)) * 100000000000n;
    if (t.includes(".")) {
      out += BigInt(parseInt(t.split(".")[1].padEnd(11, "0"))) * (t.startsWith("-") ? -1n : 1n);
    }
    return out;
  }));

function sqrt(a) {
  const _m = m**2n;
  const fixedNum = a * _m**2n;
  if (fixedNum < 0) return 0n;
  const nIterCount = 3000;
  const iterCount = BigInt(nIterCount);

  let cur = 0n;
  let jump = 2n ** iterCount;
  while (true) {
    const curCube = cur ** 2n;
    const curAccCube = (cur + 1n) ** 2n;
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
  return cur / _m;
}
function sign(a) {
  return a > 0n ? 1n : a === 0n ? 0n : -1n
}
function calc(a, b, c, d, x) {
  return a*x**3n/m**2n + b*x**2n/m + c*x + d*m;
}
function search(type, from, to, a, b, c, d) {
  if (type === 0n) return null;
  let left = from;
  let right = to;
  let cur = (left + right) / 2n;
  while (-1n > left - right || left - right > 1n) {
    const v = calc(a, b, c, d, cur);
    if (type === 1n) {
      if (v <= 0n) {
        left = cur;
      } else {
        right = cur;
      }
    } else {
      if (v >= 0n) {
        left = cur;
      } else {
        right = cur;
      }
    }
    cur = (left + right) / 2n;
  }
  const maxDiff = sqrt(m);
  if (
    calc(a, b, c, d, cur) > maxDiff ||
    calc(a, b, c, d, cur) < -maxDiff
  ) return null;
  return cur;
}

for (const [a, b, c, d] of questions) {
  const [i1, i2] = [
    (-2n*m*b - sqrt(m**2n*(4n*b**2n - 12n*a*c))) / (6n*a),
    (-2n*m*b + sqrt(m**2n*(4n*b**2n - 12n*a*c))) / (6n*a)
  ].sort((a, b) => Number(a - b));
  const type = sign(calc(a, b, c, d, i1) - calc(a, b, c, d, i1 - m/2n));
  const ranges = [
    -1_000_000n * m,
    i1,
    i2,
    1_000_000n * m
  ];
  const out = [];
  for (let i = 1; i < ranges.length; i++) {
    if (ranges[i - 1] - ranges[i] === 0n) continue;

    const ans = search(
      type * (-1n)**(BigInt(i) + 1n),
      ranges[i - 1], ranges[i],
      a, b, c, d
    );
    if (ans === null) continue;
    out.push(Number(ans*100000000000n/m)/1e11);
  }
  console.log([...new Set(out.sort((a, b) => a - b).map(v => v.toFixed(10)))].join(" "));
}
