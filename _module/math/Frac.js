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
