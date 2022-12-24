const isDev = process?.platform !== "linux";
const [, ...numbers] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`9
13
10129414190271203
102
102666818896
1216
1217
1218
101278001
1000021412678412681
21`
)
  .trim()
  .split("\n")
  .map(line => BigInt(line));

const [k] = numbers.splice(-1, 1);
const N = numbers.length;

/** @typedef {number[][]} DPArr */
const MAX_NUMBER_COUNT = 15;
const MAX_NUMBER_LENGTH = 50;
const exp = Array.from({ length: MAX_NUMBER_COUNT * MAX_NUMBER_LENGTH + 1 }, (_, i) => 10n**BigInt(i));

const numberLengths = numbers.map(n => n.toString().length);
/** @type {[counts: number[], length: number][]} */
const dp = Array.from({ length: Number(k)**2 }, (_, i) => {
  const bin = i.toString(2);
  let len = 0;
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "0") continue;
    len += numberLengths[i];
  }
  return [Array(k).fill(0), len];
});

const queue = [0];
while (queue.length > 0) {
  const idx = queue.shift();
  const bin = idx.toString(2).padStart(N, "0");
  
  const [counts, length] = dp[idx];
  for (let i = 0; i < bin.length; i++) {
    if (bin[i] === "0") {
      const toPush = idx | (1<<i);
      if (!queue.includes(toPush)) queue.push(toPush);
    } else {
      const idxToAdd = idx - (1<<(bin.length - i));

      const number = numbers[i];
      const numberLength = numberLengths[i];
      
      const [dpCounts, dpLength] = dp[idxToAdd];
      for (let modValue = 0; i < dpCounts.length; i++) {
        const dpCount = dpCounts[modValue];
        const bModValue = BigInt(modValue);
        counts[(number*exp[dpLength] + bModValue)%k] += dpCount;
        counts[(bModValue*exp[numberLength] + number)%k] += dpCount;
      }
    }
  }
}
