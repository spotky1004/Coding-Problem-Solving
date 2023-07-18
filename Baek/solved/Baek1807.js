const isDev = process?.platform !== "linux";
const [...Ks] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1
7
15
123123124
0`
)
  .trim()
  .split("\n")
  .map(Number);
Ks.pop();

const preCalcLen = [0];
for (let i = 1; i <= 15; i++) {
  const sectionLen = 9 * 10**(i - 1);
  preCalcLen.push(
    preCalcLen[i - 1] +
    sectionLen * i + (sectionLen - Math.floor((10**i - 1) / 4) + Math.floor((10**(i - 1) - 1) / 4))
  );
}

function calcLen(n) {
  const e = Math.floor(Math.log10(n));
  const sectionLen = n - 10**e;
  return (
    preCalcLen[e] +
    sectionLen * (e + 1) + (sectionLen - Math.floor((n - 1) / 4) + Math.floor((10**e - 1) / 4))
  )
}

const out = [];
for (const K of Ks) {
  let l = 1, r = 1e14;
  while (l + 1 < r) {
    const m = Math.floor((l + r) / 2);
    if (calcLen(m) < K) l = m;
    else r = m;
  }

  const n = l;
  let An = 0;
  if (n % 4 === 0) {
    An = n;
  } else {
    An = n * 10;
    while (An % 4 !== 0) An++;
  }

  const offset = K - calcLen(n);
  out.push((An+"")[offset - 1]);
}
console.log(out.join("\n"));
