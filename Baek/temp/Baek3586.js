const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  if (!isWeb) {
    process.stdout.write(out.toString());
    process.exit(0);
  } else {
    console.log(out);
  }
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = (((!isWeb ? process.memoryUsage().heapUsed : window.performance.memory.usedJSHeapSize) - startMemory) / 1024).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
// check(`4 X * 2 + 2 /`,
// `X = -1/2`);
// check(`1 2 / 2 4 / - X *`,
// `MULTIPLE`);
// check(`1 1 X 2 + / /`,
// `NONE`);
// check(`1 1 X * 1 + /`,
// `NONE`);
// check(`4 X * 3 / 2 -`,
// `X = 3/2`);
check(`3 9 X 2 + / -`,
`X = 1`);
// check(`5 4 X / -`,
// `X = -5/4`);
// check(`0 X 3 + /`,
// `MULTIPLE`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const tokens = input
  .trim()
  .split(" ");

// code
/**
 * @param {number} a 
 * @param {number} b 
*/
function gcd(a, b) {
  return b ? gcd(b, a%b) : a;
}

class Frac {
  num = 0;
  den = 0;

  constructor(num = 0, den = 0) {
    if (den < 0) {
      num *= -1;
      den *= -1;
    }
    const div = Math.abs(gcd(num, den));
    this.num = num / div;
    this.den = den / div;
  }

  /** @param {Frac} x */
  add(x) {
    const newDen = this.den / gcd(this.den, x.den) * x.den;
    return new Frac(this.num * (newDen / this.den) + x.num * (newDen / x.den), newDen);
  }

  /** @param {Frac} x */
  sub(x) {
    const newDen = this.den / gcd(this.den, x.den) * x.den;
    return new Frac(this.num * (newDen / this.den) - x.num * (newDen / x.den), newDen);
  }

  /** @param {Frac} x */
  mul(x) {
    const newNum = this.num * x.num;
    const newDen = this.den * x.den;
    return new Frac(newNum, newDen);
  }

  /** @param {Frac} x */
  div(x) {
    if (x.num === 0) throw "Division by zero";
    const newNum = this.num * x.den;
    const newDen = this.den * x.num;
    return new Frac(newNum, newDen);
  }

  inv() {
    if (this.num === 0) throw "Division by zero";
    return new Frac(this.den, this.num);
  }

  /** @param {Frac} x */
  eq(x) {
    return x.num === this.num && x.den === this.den;
  }

  print() {
    return this.num + "/" + this.den;
  }
}



const nums = "0123456789";

const ZERO = new Frac(0, 1);
let xAdd = new Frac(0, 1);
let xMult = new Frac(1, 1);

/** @type {("X" | Frac)[]} */
const stack = [];
for (const token of tokens) {
  if (token === "X") stack.push("X");
  else if (nums.includes(token)) stack.push(new Frac(Number(token), 1));
  else {
    const op = token;
    const r = stack.pop();
    const l = stack.pop();
    if (op === "+") {
      if (l === "X") xAdd = xAdd.add(r);
      else if (r === "X") xAdd = xAdd.add(l);
      else stack.push(l.add(r));
    } else if (op === "-") {
      if (l === "X") xAdd = xAdd.sub(r);
      else if (r === "X") xAdd = xAdd.add(l);
      else stack.push(l.sub(r));
    } else if (op === "*") {
      if (l === "X") {
        if (r.eq(ZERO)) return "MULTIPLE";
        xMult = xMult.mul(r);
        xAdd = xAdd.mul(r);
      } else if (r === "X") {
        if (l.eq(ZERO)) return "MULTIPLE";
        xMult = xMult.mul(l);
        xAdd = xAdd.mul(l);
      }
      else stack.push(l.mul(r));
    } else if (op === "/") {
      if (l === "X") {
        xMult = xMult.div(r);
        xAdd = xAdd.div(r);
      } else if (r === "X") {
        xMult = xMult.inv().mul(l);
      }
      else stack.push(l.div(r));
    }
    if (l === "X" || r === "X") stack.push("X");
  }
  console.log(token, stack.map(v => v !== "X" ? v.print() : "X"), xAdd.print(), xMult.print())
}
console.log(xAdd.print(), xMult.print());

// output
return `X = ${ZERO.sub(xAdd).div(xMult).print()}`;
}
