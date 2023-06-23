const isDev = process?.platform !== "linux";
const [...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`999999999
abaababa
`
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
 * @param {number[]} lps 
*/
function kmp(str, pattern, lps) {
  let matchCount = 0;

  let i = 0;
  let j = 0;
  while (i < str.length) {
    if (str[i] === pattern[j]) {
      i++;
      j++;
    }
    if (j === pattern.length) {
      matchCount++;
      j = lps[j - 1];
    } else if (i < str.length && str[i] !== pattern[j]) {
      if (j === 0) i++;
      j = lps[j - 1] ?? 0;
    }
  }
  return matchCount;
}



const p = 20062006n;
const m = Number(input[0]);
const a = input[1];

const fibPatterns = ["b", "a"];
const fib = [1, 1];
while (true) {
  const newFib = fibPatterns[fibPatterns.length - 1] + fibPatterns[fibPatterns.length - 2];
  if (newFib.length > 2500000) break;
  fibPatterns.push(newFib);
  fib.push(newFib.length);
}

const lastFibIdx = fibPatterns.length - 1;
const last1Fib = fibPatterns[fibPatterns.length - 1];
const last2Fib = fibPatterns[fibPatterns.length - 2];

const aLen = a.length;
const aLenM = aLen - 1;

const lps = makeLps(a);
const s = last1Fib.slice(0, aLenM);
const e1 = aLenM === 0 ? "" : lastFibIdx % 2 === 0 ? last1Fib.slice(-aLenM) : last2Fib.slice(-aLenM);
const e2 = aLenM === 0 ? "" : lastFibIdx % 2 === 0 ? last2Fib.slice(-aLenM) : last1Fib.slice(-aLenM);
const e1Count = BigInt(kmp(e1 + s, a, lps));
const e2Count = BigInt(kmp(e2 + s, a, lps));

const dp = [BigInt(a === "b"), BigInt(a === "a")];
let out = -1;
dp[2] = dp[1] + dp[0] + BigInt(a === "ab");
dp[3] = dp[2] + dp[1] + BigInt(a === "aba" || a === "ba");
let nonZeroAppeared = false;
for (let i = 4; i <= m; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
  if ((fib[i - 2] ?? Infinity) < aLenM) {
    const e = i % 2 === 1 ? e1 : e2;
    dp[i] += BigInt(kmp(e.slice(-fib[i - 1]) + s.slice(0, fib[i - 2]), a, lps));
  } else {
    dp[i] += i % 2 === 1 ? e1Count : e2Count;
  }
  dp[i] %= p;
  if (nonZeroAppeared && dp[i] === 0n) {
    out = (i % 2 === m % 2) ? 0 : dp[i - 1];
    break;
  } else {
    nonZeroAppeared = true;
  }
}
if (out === -1) out = dp[m];
console.log(`${out} ${1}`);
