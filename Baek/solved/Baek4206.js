const isDev = process?.platform !== "linux";
const [...input] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`6
10
7
10
6
01
6
101
96
10110101101101
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



const fibPatterns = ["0", "1"];
const fib = [1, 1];
while (true) {
  const newFib = fibPatterns[fibPatterns.length - 1] + fibPatterns[fibPatterns.length - 2];
  if (newFib.length > 400000) break;
  fibPatterns.push(newFib);
  fib.push(newFib.length);
}

const lastFibIdx = fibPatterns.length - 1;
const last1Fib = fibPatterns[fibPatterns.length - 1];
const last2Fib = fibPatterns[fibPatterns.length - 2];

const out = [];
for (let line = 0; line < input.length; ) {
  const n = Number(input[line]);
  const p = input[line + 1].trim();
  line += 2;
  const pLenM = p.length - 1;
  
  const lps = makeLps(p);
  const s = last1Fib.slice(0, pLenM);
  const e1 = pLenM === 0 ? "" : lastFibIdx % 2 === 0 ? last1Fib.slice(-pLenM) : last2Fib.slice(-pLenM);
  const e2 = pLenM === 0 ? "" : lastFibIdx % 2 === 0 ? last2Fib.slice(-pLenM) : last1Fib.slice(-pLenM);
  const e1Count = BigInt(kmp(e1 + s, p, lps));
  const e2Count = BigInt(kmp(e2 + s, p, lps));

  const dp = [BigInt(p === "0"), BigInt(p === "1")];
  dp[2] = dp[1] + dp[0] + BigInt(p === "10");
  dp[3] = dp[2] + dp[1] + BigInt(p === "101" || p === "01");
  for (let i = 4; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    if ((fib[i - 2] ?? Infinity) < pLenM) {
      const e = i % 2 === 1 ? e1 : e2;
      dp[i] += BigInt(kmp(e.slice(-fib[i - 1]) + s.slice(0, fib[i - 2]), p, lps));
    } else {
      dp[i] += i % 2 === 1 ? e1Count : e2Count;
    }
  }
  out.push(`Case ${line / 2}: ${dp[n]}`);
}
console.log(out.join("\n"));
