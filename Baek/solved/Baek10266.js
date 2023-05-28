const isDev = process?.platform !== "linux";
const [[N], a, b] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`7
1 2 3 4 5
359999 0 1 2 3`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

/**
 * @param {string} str 
*/
function makeLps(str) {
  const lps = Array(str.length);
  lps[0] = 0;

  let i = 1;
  let j = 0;
  while (i < str.length) {
    if (str[i] === str[j]) {
      lps[i] = ++j;
      i++;
    } else {
      if (j !== 0) j = lps[j - 1];
      else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

/**
 * @param {string} str 
 * @param {string} pattern 
*/
function kmp(str, pattern) {
  const lps = makeLps(pattern);
  const matchIdxes = [];

  let i = 0;
  let j = 0;
  while (i < str.length) {
    if (str[i] === pattern[j]) {
      i++;
      j++;
    }
    if (j === pattern.length) {
      matchIdxes.push(i - j);
      j = lps[j - 1];
    } else if (i < str.length && str[i] !== pattern[j]) {
      if (j === 0) i++;
      j = lps[j - 1] ?? 0;
    }
  }
  return matchIdxes;
}



function makeDiffArr(arr) {
  arr.sort((a, b) => a - b);

  const diff = [];
  diff.push(360000 + arr[0] - arr[arr.length - 1]);

  for (let i = 1; i < arr.length; i++) {
    diff.push(arr[i] - arr[i - 1]);
  }
  return diff;
}

const aDiff = makeDiffArr(a);
const bDiff = makeDiffArr(b);

const aDiffStr = aDiff.concat(aDiff).join(",");
const bDiffStr = bDiff.join(",");

console.log(kmp(aDiffStr, bDiffStr).length > 0 ? "possible" : "impossible");
