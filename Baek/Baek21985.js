const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`NE?(ER)C++|(IS)*?|(CHA((LL))ENGING)
`
)
  .trim();

/**
 * @param {string} letter 
 */
function createLetterBox(letter) {
  const line = "-".repeat(letter[0].length + 2);
  return [`+${line}+`, `+ ${letter[0]} +`, `+${line}+`];
}

class Base {
  constructor() {
  }

  /**
   * @returns {string[]}
   */
  getStr() {
    return [];
  }
}
class Expr extends Base {
  constructor() {
    super();
  }
}
class Term extends Base {
  /**
   * @typedef {"single" | "connected"} ExprType
   * @typedef {[Expr | Atom, Expr | Atom]} ExprVal
   */

  /** @type {ExprType} */
  type;
  /** @type {ExprVal} */
  val;

  /**
   * @param {ExprType} type 
   * @param {ExprVal} val 
   */
  constructor(type, val) {
    super();
    this.type = type;
    this.val = val;
  }

  /**
   * @returns {string[]}
   */
  getStr() {
    const type = this.type;
    if (type === "single") {
      const atom = this.val[0];
      return atom.getStr();
    } else if (type === "connected") {
      let strs = this.val.map(v => v.getStr());
      const maxHeight = Math.max(...strs.map(s => s.length));
      strs = strs.map(s => s.concat(Array(maxHeight - s.length).fill(" ".repeat(s[0].length))));
      /** @type {string[]} */
      const merged = [];
      for (let i = 0; i < maxHeight; i++) {
        merged[i] = "";
        for (let j = 0; j < strs.length; j++) {
          merged[i] += strs[j][i];
          if (i === 1) {
            merged[i] += "->";
          } else if (j !== strs.length - 1) {
            merged[i] += "  ";
          }
        }
      }
      return merged;
    }
  }
}
class Atom extends Base {
  /**
   * @typedef {"letter" | "expr" | "plus" | "question" | "asterisk"} AtomType
   * @typedef {Letter | Expr | Atom} AtomVal
   */

  /** @type {AtomType} */
  type;
  /** @type {AtomVal} */
  val;

  /**
   * @param {AtomType} type 
   * @param {AtomVal} val 
   */
  constructor(type, val) {
    super();
    this.type = type;
    this.val = val;
  }

  /**
   * @returns {string[]}
   */
  getStr() {
    const type = this.type;
    if (type === "letter") {
      return createLetterBox(this.val.getStr());
    } else if (type === "plus") {
      const str = this.val.getStr();
      const len = str[0].length + 6;
      str[0] = `   ${str[0]}   `
      str[1] = `+->${str[1]}->+`;
      for (let i = 2; i < str.length; i++) {
        str[i] = `|  ${str[i]}  |`;
      }
      str.push(`|${" ".repeat(len - 2)}|`);
      str.push(`+<${"-".repeat(len - 3)}+`);
      return str;
    } else if (type === "question") {
      const str = this.val.getStr();
      const len = str[0].length + 6;
      str[0] = `|  ${str[0]}  |`;
      str[1] = `+->${str[1]}->+`;
      for (let i = 2; i < str.length; i++) {
        str[i] = `   ${str[i]}   `
      }
      str.unshift(`|${" ".repeat(len - 2)}|`);
      str.unshift(`+${"-".repeat(len - 3)}>+`);
      str.unshift(" ".repeat(len));
      return str;
    } else if (type === "asterisk") {
      const str = this.val.getStr();
      const len = str[0].length + 6;
      str[1] = `+->${str[1]}->+`;
      for (let i = 0; i < str.length; i++) {
        if (i === 1) continue;
        str[i] = `|  ${str[i]}  |`;
      }
      str.unshift(`|${" ".repeat(len - 2)}|`);
      str.unshift(`+${"-".repeat(len - 3)}>+`);
      str.unshift(" ".repeat(len));
      str.push(`|${" ".repeat(len - 2)}|`);
      str.push(`+<${"-".repeat(len - 3)}+`);
      return str;
    } else if (type === "expr") {
      return this.val.getStr();
    }
  }
}
class Letter extends Base {
  str = "";

  /**
   * @param {string} str
   */
  constructor(str) {
    super();
    this.str = str;
  }

  getStr() {
    return [this.str];
  }
}

const atom1 = new Atom("question", new Atom("asterisk", new Atom("letter", new Letter("EEEE"))));
const atom2 = new Atom("question", new Atom("letter", new Letter("FFFF")));
const term = new Term("connected", [atom1, atom2])
console.log(term.getStr().join("\n"));
