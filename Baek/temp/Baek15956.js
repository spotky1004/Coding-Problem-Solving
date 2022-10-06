const isDev = process.platform !== "linux";
const conds = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`festival==kakao&&festival==2018&&haha==123456&&hoho!=123456`
)
  .trim()
  .split("&&");

/** @type {Map<string, string | string[]>} */
const varMap = new Map();
/**
 * @param {string} left 
 * @param {string} right 
 * @param {0 | 1} type 
 */
function addVar(left, right, type) {
  const shorter = left.length > right.length ? left : right;
  const longer = left.length > right.length ? right : left;
  const shorterVal = varMap.get(shorter);
  const longerVar = varMap.get(longer);
  const typeMarker = type === 1 ? "" : "_";
  if (Array.isArray(shorterVal)) {
    shorterVal.push(typeMarker + right);
  } else {

  }
}

for (const cond of conds) {
  /** @type {string} */
  let left;
  /** @type {string} */
  let right;
  /** @type {0 | 1} */
  let type;
  if (conds.include("!")) {
    [left, right] = cond.split("!=");
    type = 0;
  } else {
    [left, right] = cond.split("==");
    type = 1;
  }
  addVar(left, right, type);
}
