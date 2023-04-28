const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`1001`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

const splited = Array.from(N+"").map(Number).reverse();
const counts = Array(10).fill(0);

for (let i = 0; i < splited.length; i++) {
  const digit = splited[i];
  
  for (let j = i + 1; j < splited.length; j++) {
    counts[splited[j]] += digit * 10**i;
  }

  for (let j = 0; j <= digit - 1; j++) {
    counts[j] += 10**i;
  }
  counts[digit] += 1;

  for (let j = 0; j <= 9; j++) {
    counts[j] += Math.floor(digit * i * 10**(i - 1));
  }

  counts[0] -= 10**i;
}

console.log(counts.map(v => Math.max(0, v)).join(" "));
