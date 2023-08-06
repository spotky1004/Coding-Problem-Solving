const isDev = typeof window !== "undefined" || require("os").userInfo().username === "spotky";

if (!isDev) {
  const input = require("fs").readFileSync("/dev/stdin").toString();
  const out = solve(input);
  console.log(out);
} else {
  let CASE_NR = 0;
  function check(input, answer) {
    CASE_NR++;
    const startTime = new Date().getTime();
    const out = solve(input);
    const deltaStr = (new Date().getTime() - startTime).toString();
    const deltaZeroStr = " "+"0".repeat(6 - deltaStr.length);
    if (out.toString() === answer) console.log("\x1b[1m%s\x1b[42m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[40m", `Case ${CASE_NR}: `, ` AC `, deltaZeroStr, deltaStr+"ms");
    else console.log("\x1b[1m%s\x1b[41m%s\x1b[0m\x1b[90m%s\x1b[0m%s\x1b[31m%s\x1b[0m", `Case ${CASE_NR}: `, ` WA `, deltaZeroStr, deltaStr+"ms\n", out);
  }

  check("3", "");
}

function solve(input) {
const [[N]] = input
  .split("\n")
  .map(line => line.split(" ").map(Number));

return "";
}
