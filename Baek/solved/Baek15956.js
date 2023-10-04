const isWeb = typeof window === "object";
const isDev = isWeb || require("fs").existsSync("C:/users/spotky");

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  if (!isWeb) require('node:v8').setFlagsFromString('--stack-size=65536');

  let CASE_NR = 1;
  function check(input, answer, caseName=`Case ${CASE_NR}`) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const startMemory = !isWeb ? process.memoryUsage().heapUsed / 1024 : 0;
    const out = solve(input).toString().trim();
    const timeDeltaStr = (new Date().getTime() - startTime).toString();
    const timeDeltaZeroStr = " "+"0".repeat(6 - timeDeltaStr.length);
    const memoryDelta = ((!isWeb ? process.memoryUsage().heapUsed / 1024 : 0) - startMemory).toFixed(0);
    const memoryDeltaZeroStr = " "+"0".repeat(8 - memoryDelta.length);
    if (
      typeof answer === "string" ?
        out === answer :
        answer.includes(out)
    ) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m", `${caseName}: `, ` AC `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `${caseName}: `, ` WA `, timeDeltaZeroStr, timeDeltaStr+"ms", memoryDeltaZeroStr, memoryDelta+"KB\n", out.slice(0, 10000));
  }

// cases
check(`festival==kakao&&festival==2018&&haha==123456&&hoho!=123456`,
[
  `festival==2018&&kakao==2018&&haha==123456&&hoho!=haha`,
  `2018==kakao&&haha==123456&&2018==festival&&haha!=hoho`
]);
check(`kakaocodefestival==-20180804&&hello!=-20180804`,
[
  `kakaocodefestival==-20180804&&hello!=-20180804`,
  `-20180804==kakaocodefestival&&-20180804!=hello`
]);
check(`a==b&&b==c&&c==a`,
`a==b&&a==c`);
check(`int==float`,
`int==float`);
check(`a==A&&B==b`,
[
  `A==a&&b==B`,
  `a==A&&B==b`
]);
check(`a==b&&a!=b`,
`1!=1`);
check(`a==1&&a==2`,
`1!=1`);
check(`ab==cde&&abc==de&&a!=bcde&&abcd!=e`,
[
  `abc==de&&cde==ab&&e!=abcd&&bcde!=a`,
  `ab==cde&&de==abc&&a!=bcde&&abcd!=e`
]);
check(`a==a&&3==3&&3==3&&ab==ab&&0==0&&1!=2`,
`1==1`);
check(`11==11&&a==11`,
`a==11`);
check(`a!=b&&c!=d&&a!=c&&b!=d&&a==d&&b==c`,
[
  `a==d&&b==c&&a!=b`
]);
check(`a==111&&b==111&&c==111`,
[
  `b==a&&b==c&&b==111`,
  `a==b&&a==c&&a==111`
]);
check(`a!=123&&a==234`,
`a==234`);
check(`a!=123&&a==123`,
`1!=1`);
check(`a==-1&&a==b&&b==-1&&b!=2&&a!=2&&1!=a`,
`a==b&&a==-1`);
check(`0==0&&0!=1&&1==1&&2==2&&abc==abc&&abc==1234&&abc!=2&&a==1234&&a!=1`,
[
  `a==abc&&a==1234`,
  `a==1234&&a==abc`
]);
}

/**
 * @param {string} input 
 */
function solve(input) {
// input
const exprs = input
  .trim()
  .split("&&");

// code
/**
 * @param {number} a 
*/
function find(a) {
  if (roots[a] === a) return a;

  const root = find(roots[a]);
  roots[a] = root;
  return root;
}

/**
 * @param {number} a 
 * @param {number} b 
*/
function union(a, b){
  a = find(a);
  b = find(b);

  if (a === b) return;

  if (rank[a] < rank[b]) {
    roots[a] = b;
  } else {
    roots[b] = a;
    if (rank[a] === rank[b]) {
      rank[a]++;
    }
  }
}

function isNumberTerm(x) {
  return !isNaN(parseInt(x));
}





/** @type {[a: string, b: string][]} */
const eqExprs = [];
/** @type {[a: string, b: string][]} */
const neqExprs = [];
for (const expr of exprs) {
  if (expr.includes("==")) {
    eqExprs.push(expr.split("=="));
  } else {
    neqExprs.push(expr.split("!="));
  }
}

/** @type {Set<string>} */
const termSeen = new Set();
/** @type {string[]} */
const terms = [];
for (const ab of eqExprs) {
  for (const term of ab) {
    if (termSeen.has(term)) continue;
    terms.push(term);
    termSeen.add(term);
  }
}
for (const ab of neqExprs) {
  for (const term of ab) {
    if (termSeen.has(term)) continue;
    terms.push(term);
    termSeen.add(term);
  }
}

const rank = Array.from({ length: terms.length + 1 }, _ => 1);
const roots = Array.from({ length: terms.length + 1 }, (_, i) => i);

terms.sort((a, b) => {
  const lenDiff = a.length - b.length;
  if (lenDiff !== 0) return lenDiff;
  if (isNumberTerm(a)) return -1;
  return 1;
});
const termToNode = new Map(terms.map((term, i) => [term, i]));
for (const [a, b] of eqExprs) {
  const [aNode, bNode] = [termToNode.get(a), termToNode.get(b)];
  union(aNode, bNode);
}

const trueExpr = "1==1";
const falseExpr = "1!=1";

const hasNumInUnion = Array(terms.length).fill(false);
for (let i = 0; i < terms.length; i++) {
  if (!isNumberTerm(terms[i])) continue;
  const unionIdx = find(i);
  if (hasNumInUnion[unionIdx]) return falseExpr;
  hasNumInUnion[unionIdx] = true;
}

const minNodeOfUnion = Array.from({ length: terms.length }, (_, i) => i);
for (let i = 0; i < terms.length; i++) {
  const unionIdx = find(i);
  if (terms[i].length < terms[minNodeOfUnion[unionIdx]].length) {
    minNodeOfUnion[unionIdx] = i;
  }
}

const out = [];
const hasMergedWithNumber = Array(terms.length).fill(false);
for (let i = 0; i < terms.length; i++) {
  const term = terms[i];
  const node = termToNode.get(term);
  const minNode = minNodeOfUnion[find(node)];
  if (minNode === node) continue;

  const [lNode, rNode] = [terms[minNode], term];
  if (isNumberTerm(lNode)) hasMergedWithNumber[i] = true;
  if (isNumberTerm(rNode)) hasMergedWithNumber[minNode] = true;
  out.push(`${terms[minNode]}==${term}`);
}

const neqOuts = new Set();
for (const [a, b] of neqExprs) {
  const [aNode, bNode] = [termToNode.get(a), termToNode.get(b)];
  const [aUnionNode, bUnionNode] = [find(aNode), find(bNode)];
  const [aUnionMinNode, bUnionMinNode] = [minNodeOfUnion[aUnionNode], minNodeOfUnion[bUnionNode]];
  const [aUnionMinTerm, bUnionMinTerm] = [terms[aUnionMinNode], terms[bUnionMinNode]];
  if (aUnionMinTerm === bUnionMinTerm) return falseExpr;
  if (
    (
      !isNumberTerm(aUnionMinTerm) && isNumberTerm(bUnionMinTerm) &&
      hasMergedWithNumber[aUnionMinNode]
    ) || (
      !isNumberTerm(bUnionMinTerm) && isNumberTerm(aUnionMinTerm) &&
      hasMergedWithNumber[bUnionMinNode]
    ) || (
      hasNumInUnion[aUnionNode] &&
      hasNumInUnion[bUnionNode]
    )
  ) continue;
  
  const [lTerm, rTerm] = [aUnionMinTerm, bUnionMinTerm].sort();
  const expr = `${lTerm}!=${rTerm}`;
  if (neqOuts.has(expr)) continue;
  out.push(expr);
  neqOuts.add(expr);
}

// output
if (out.length === 0) return trueExpr;
return out.join("&&");
}
