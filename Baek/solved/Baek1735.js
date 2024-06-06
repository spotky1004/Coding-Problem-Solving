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
check(`2 7
3 5`,
`31 35`);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const [[na, da], [nb, db]] = input
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

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
    const newNum = this.num * x.den;
    const newDen = this.den * x.num;
    return new Frac(newNum, newDen);
  }

  inv() {
    return new Frac(this.den, this.num);
  }

  /** @param {Frac} x */
  eq(x) {
    return x.num === this.num && x.den === this.den;
  }

  /**
   * @param  {...Frac} x 
   */
  max(...x) {
    let max = this;
    for (const f of x) {
      if (this.num * f.den < f.num * this.den) max = f;
    }
    return new Frac(max.num, max.den);
  }

  /**
   * @param  {...Frac} x 
   */
  min(...x) {
    let min = this;
    for (const f of x) {
      if (this.num * f.den > f.num * this.den) min = f;
    }
    return new Frac(min.num, min.den);
  }

  print() {
    if (this.den === 1) return this.num.toString();
    return this.num + "/" + this.den;
  }
}



const ans = new Frac(na, da).add(new Frac(nb, db));

// output
return `${ans.num} ${ans.den}`;
}
