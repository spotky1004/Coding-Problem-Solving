const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));


/**
 * @param {number} n 
*/
function genPrimes(n) {
  /** @type {(number | null)[]} */
  const net = Array.from({ length: n }, (_, i) => i);
  net[0] = null;
  net[1] = null;
  for (let i = 4; i < net.length; i += 2) {
    net[i] = null;
  }
  for (let i = 3; i < net.length; i++) {
    if (net[i] === null) continue;
    for (let j = i * 3; j < net.length; j += i * 2) {
      net[j] = null;
    }
  }
  return net.filter(v => v !== null);
}



const e10th = 4e10;
const squares = genPrimes(Math.ceil(Math.sqrt(e10th))).map(v => v**2);
const incExcs = [];
for (let i = 0; i < squares.length; i++) {
  const s = squares[i];
  incExcs.push([]);
  for (let j = 0; j < incExcs.length; j++) {
    let pushed = false;
    const prev = incExcs[j - 1] ?? null;
    const cur = incExcs[j];

    cur.push(-s);
    if (prev === null) {
      cur.push(s);
      pushed = true;
    } else {
      for (const e of prev) {
        if (e < 0 || e % s === 0) continue;
        const toPush = e * s;
        if (toPush * s > e10th) continue;
        cur.push(toPush);
        pushed = true;
      }
    }

    if (!pushed) {
      if (incExcs[incExcs.length - 1].length === 0) incExcs.pop();
      cur.pop();
      break;
    }
  }
}

function getOrder(n) {
  for (const s of squares) {
    if (n < s) break;
    if (n % s === 0) {
      return -1;
    }
  }

  const squareCounts = [];
  for (const s of squares) {
    if (n < s) break;
    squareCounts.push(Math.floor(n / s));
  }

  let sub = 0;
  for (let j = 0; j <= squareCounts.length; j++) {
    const curIncExc = incExcs[j];
    if (typeof curIncExc === "undefined") break;

    let l = 0;
    let r = squareCounts.length - 1;
    let isFirst = false;
    for (const e of curIncExc) {
      if (e < 0) {
        while (squares[l] <= -e) l++;
        isFirst = true;
        continue;
      }
      if (isFirst) {
        while (e > squareCounts[r]) r--;
      }
      isFirst = false;
      for (let i = l; i <= r; i++) {
        sub -= ((j % 2) * 2 - 1) * Math.floor(squareCounts[i] / e);
      }
    }
  }

  return n - (squareCounts.reduce((a, b) => a + b, 0) - sub);
}

let ans = null;
let left = 0;
let right = e10th;
let prev = 0;
let dx = 0;
while (true) {
  const mid = Math.ceil((left + right) / 2);
  const midOrder = getOrder(mid);
  if (midOrder === -1) {
    if (dx === -1) {
      left--;
    } else {
      right++;
    }
    continue;
  }

  if (midOrder > N) {
    if (prev !== midOrder) right = Math.ceil(mid / 8) * 8;
    else right = mid;
    dx = -1;
  } else if (midOrder < N) {
    if (prev !== midOrder) left = Math.floor(mid / 8) * 8;
    else left = mid;
    dx = 1;
  } else {
    ans = mid;
    break;
  }

  prev = midOrder;
}

console.log(ans);
