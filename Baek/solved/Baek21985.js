const isDev = process.platform !== "linux";
const input = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`((A)**B)+
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
  toStrings() {
    return [];
  }
}
class Expr extends Base {
  /**
   * @typedef {"single" | "union"} ExprType
   * @typedef {Term[]} ExprVal
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
  toStrings() {
    const type = this.type;
    if (type === "single") {
      return this.val[0].toStrings();
    } else if (type === "union") {
      let strs = this.val.map(v => v.toStrings());
      const maxWidth = Math.max(...strs.map(v => (v[0] ?? "").length));
      const merged = [];
      for (let i = 0; i < strs.length; i++) {
        const str = strs[i];
        const spaceCount = maxWidth - (str[0] ?? "").length;
        for (let j = 0; j < str.length; j++) {
          const line = str[j];
          if (j === 0) {
            if (i === 0) {
              merged.push(`   ${line}${" ".repeat(spaceCount)}   `);
            } else {
              merged.push(`|  ${line}${" ".repeat(spaceCount)}  |`);
            }
          } else if (j === 1) {
            merged.push(`+->${line}${"-".repeat(spaceCount)}->+`);
          } else {
            if (i === strs.length - 1) {
              merged.push(`   ${line}${" ".repeat(spaceCount)}   `);
            } else {
              merged.push(`|  ${line}${" ".repeat(spaceCount)}  |`);
            }
          }
        }
        if (i !== strs.length - 1) {
          merged.push(`|  ${" ".repeat(maxWidth)}  |`);
        }
      }
      return merged;
    }
  }
}
class Term extends Base {
  /**
   * @typedef {"single" | "connected"} TermType
   * @typedef {(Expr | Atom)[]} TermVal
   */

  /** @type {TermType} */
  type;
  /** @type {TermVal} */
  val;

  /**
   * @param {TermType} type 
   * @param {TermVal} val 
   */
  constructor(type, val) {
    super();
    this.type = type;
    this.val = val;
  }

  /**
   * @returns {string[]}
   */
  toStrings() {
    const type = this.type;
    if (type === "single") {
      const atom = this.val[0];
      return atom.toStrings();
    } else if (type === "connected") {
      let strs = this.val.map(v => v.toStrings());
      const maxHeight = Math.max(...strs.map(s => s.length));
      strs = strs.map(s => s.concat(Array(maxHeight - s.length).fill(" ".repeat(s[0].length))));
      /** @type {string[]} */
      const merged = [];
      for (let i = 0; i < maxHeight; i++) {
        merged[i] = "";
        for (let j = 0; j < strs.length; j++) {
          merged[i] += strs[j][i];
          if (i === 1) {
            if (j !== strs.length - 1) {
              merged[i] += "->";
            }
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
  toStrings() {
    const type = this.type;
    if (type === "letter") {
      return createLetterBox(this.val.toStrings());
    } else if (type === "plus") {
      const str = this.val.toStrings();
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
      const str = this.val.toStrings();
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
      const str = this.val.toStrings();
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
      return this.val.toStrings();
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

  toStrings() {
    return [this.str];
  }
}

// const N = new Atom("letter", new Letter("N"));
// const E = new Atom("question", new Atom("letter", new Letter("E")));
// const ER = new Atom("expr", new Expr("single", [new Atom("letter", new Letter("ER"))]));
// const C = new Atom("plus", new Atom("plus", new Atom("letter", new Letter("C"))));
// const part1 = new Term("connected", [N, E, ER, C]);
// const IS = new Atom("question", new Atom("asterisk", new Atom("letter", new Letter("IS"))));
// const part2 = new Term("single", [IS]);
// const CHA = new Atom("letter", new Letter("CHA"));
// const LL = new Expr("single", [new Expr("single", [new Atom("letter", new Letter("LL"))])]);
// const ENGING = new Atom("letter", new Letter("ENGING"));
// const part3 = new Term("single", [new Atom("expr", new Expr("single", [new Term("connected", [CHA, LL, ENGING])]))]);
// const sampleExpr = new Expr("union", [part1, part2, part3]);
// console.log(sampleExpr.toStrings().join("\n"));

/**
 * @param {string} str 
 * @returns {Expr}
 */
function parsExpr(str) {
  const parts = [];
  let bracketLevel = 0;
  let stack = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    stack += char;
    if (
      bracketLevel === 0 &&
      char === "|"
    ) {
      parts.push(stack.slice(0, -1));
      stack = "";
    } else if (char === "(") {
      bracketLevel++;
    } else if (char === ")") {
      bracketLevel--;
    }
  }
  if (stack.length > 0) {
    parts.push(stack);
  }
  if (parts.length <= 1) {
    return new Expr("single", [parseTerm(str)])
  } else {
    return new Expr("union", parts.map(v => parseTerm(v)));
  }
}
const countSymbols = ["+", "?", "*"];
/**
 * @param {string} str 
 * @returns {Term}
 */
function parseTerm(str) {
  const parts = [];
  let bracketLevel = 0;
  let hasSymbol = false;
  let stack = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];
    if (
      hasSymbol &&
      !countSymbols.includes(char) &&
      bracketLevel === 0
    ) {
      parts.push(stack);
      hasSymbol = false;
      stack = "";
    }
    stack += char;

    if (char === "(") {
      if (
        stack.length > 1 &&
        bracketLevel === 0
      ) {
        parts.push(stack.slice(0, -1));
        stack = stack.slice(-1);
      }
      bracketLevel++;
    } else if (char === ")") {
      bracketLevel--;
      if (bracketLevel === 0) {
        parts.push(stack);
        hasSymbol = false;
        stack = "";
      }
    } else {
      if (bracketLevel !== 0) continue;

      if (
        !hasSymbol &&
        countSymbols.includes(char)
      ) {
        if (
          stack.length >= 3 &&
          bracketLevel === 0
        ) {
          parts.push(stack.slice(0, -2));
          stack = stack.slice(-2);
        }
        hasSymbol = true;
      }
    }
  }
  if (stack.length > 0) {
    if (/[A-Z]/.test(stack)) {
      parts.push(stack);
    } else {
      parts[parts.length - 1] += stack;
    }
  }
  // dirty code :(
  const fixedParts = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.split("").every(c => countSymbols.includes(c))) {
      fixedParts[fixedParts.length - 1] += part;
    } else {
      fixedParts.push(part);
    }
  }
  if (fixedParts.length <= 1) {
    return new Term("single", [parseAtom(str)]);
  } else {
    return new Term("connected", fixedParts.map(v => parseAtom(v)));
  }
}
/**
 * @param {string} str 
 * @returns {Atom}
 */
function parseAtom(str) {
  const endChar = str.slice(-1);
  if (countSymbols.includes(endChar)) {
    const restPart = str.slice(0, -1);
    if (endChar === "+") {
      return new Atom("plus", parseAtom(restPart));
    } else if (endChar === "?") {
      return new Atom("question", parseAtom(restPart));
    } else {
      return new Atom("asterisk", parseAtom(restPart));
    }
  } else if (str.startsWith("(")) {
    const restPart = str.slice(1, -1);
    return new Atom("expr", parsExpr(restPart));
  } else {
    return new Atom("letter", parseLetter(str));
  }
}
/**
 * @param {string} str 
 */
function parseLetter(str) {
  return new Letter(str);
}
const expr = parsExpr(input);
const output = expr.toStrings();
for (let i = 0; i < output.length; i++) {
  if (i === 1) {
    output[i] = `S->${output[i]}->F`;
  } else {
    output[i] = `   ${output[i]}   `;
  }
}
output.unshift(output.length + " " + output[0].length);
console.log(output.join("\n"));
