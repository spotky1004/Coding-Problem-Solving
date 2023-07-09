const isDev = process?.platform !== "linux";
const [N, M, S] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`2
13
OOIOIOIOIIOII`
)
  .trim()
  .split("\n");

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



const pattern = "IO".repeat(N) + "I";
console.log(kmp(S, pattern).length);
