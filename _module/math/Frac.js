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
    const div = gcd(newNum, newDen);
    return new Frac(newNum / div, newDen / div);
  }

  /** @param {Frac} x */
  div(x) {
    const newNum = this.num * x.den;
    const newDen = this.den * x.num;
    const div = gcd(newNum, newDen);
    return new Frac(newNum / div, newDen / div);
  }

  print() {
    return this.num + "/" + this.den;
  }
}
