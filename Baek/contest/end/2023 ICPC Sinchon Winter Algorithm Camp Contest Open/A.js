const isDev = process?.platform !== "linux";
const [[N]] = (
  !isDev
    ? require("fs").readFileSync("/dev/stdin").toString()
    :
`12023`
)
  .trim()
  .split("\n")
  .map(line => line.split(" ").map(Number));

// const toMatch = "2023";
// function calcMatchCount(n, depth) {
//   console.log(depth, n);
//   if (depth === toMatch.length) return 1;

//   const matchChar = toMatch[depth];
  
//   let cases = 0;
//   let caseMult = "";
//   for (let i = 0; i < n.length - toMatch.length + depth + 1; i++) {
//     const c = n[i];
//     const canAddDepth = i >= 1 || Number(c) >= matchChar;
//     if (canAddDepth) {
//       cases += calcMatchCount(n.slice(i + 1), depth + 1) * (Number(caseMult) + 1);
//     }
//     caseMult += c;
//   }

//   return cases;
// }

// const out = calcMatchCount(N.toString(), 0);
// console.log(out);

let cases = 0;
const toMatch = ["2", "0", "2", "3"];
for (let i = 1; i <= N; i++) {
  const str = i.toString();
  let matchCount = 0;
  for (let j = 0; j < str.length; j++) {
    const c = str[j];
    if (c === toMatch[matchCount]) matchCount++;
  }
  
  if (matchCount === toMatch.length) {
    cases++;
  }
}

console.log(cases);
